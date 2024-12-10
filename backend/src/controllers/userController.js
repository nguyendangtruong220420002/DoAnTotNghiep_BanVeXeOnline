const User = require('../../src/models/User');
const Bus = require('../../src/models/Bus');
const BusRoute = require('../../src/models/BusRoute');
const Trips = require('../../src/models/Trips');
const Booking = require('../models/Booking');



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { upload, uploadMobile } = require('../config/s3');
const { formatBase64ToBuffer } = require('../config/base64');

const createUser = async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;
  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Số điện thoại đã được sủ dụng.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await newUser.save();
    res.status(201).json({ message: 'Người dùng đã được tạo thành công!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo tài khoản.' });
  }
};
const checkPhoneNumberExists = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user) {
      return res.status(200).json({ exists: true, message: "Số điện thoại đã tồn tại.", user: user });
    }
    return res.status(201).json({ exists: false, message: "Số điện thoại không tồn tại." });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi kiểm tra số điện thoại.", error });
  }
};
const loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ message: 'Số điện thoại không tồn tại.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Đăng nhập thành công!', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập.' });
  }
};
const updateUser = async (req, res) => {
  console.log('Hàm updateUser được gọi');
  console.log('req.body:', req.body);

  const userId = req.params.id;
  console.log('data:', req.body);

  try {
    //console.log('req.file:', req.file);
    const img = req.file ? req.file.location : undefined;
    //console.log('Đường dẫn ảnh:', img);
    const userId = req.params.id;
    // console.log('User ID:', userId);
    const updatedUser = await User.findByIdAndUpdate(userId, {
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      img: img, 
    }, { new: true });
    if (!updatedUser) {
      console.log('Người dùng không tồn tại.');
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    console.log('Cập nhật người dùng thành công:', updatedUser);
    res.status(200).json({ message: 'Cập nhật thành công!', user: updatedUser });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin.' });
  }
};

const updateAvatarMobile = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;
    console.log(avatar);
    const user = await User.findById(id);
    if (!user) {

      return res.status(404).json({ error: "User not found !!!" });
    }
    if (avatar) {
      avatar.buffer = await formatBase64ToBuffer(avatar.base64);
      const result = await uploadMobile(
        `${avatar.mimetype.split("/")[0]}___${Date.now().toString()}_${avatar.originalname.split(".")[0]
        }`,
        avatar.buffer,
        avatar.mimetype,
        avatar.originalname.split(".")[0],
        avatar.buffer / 1024,
      );
      console.log(result);
      user.img = result.url;
    }

    const updatedUser = await user.save();

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error updating user information" });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== id) {
      return res.status(403).json({ message: 'Token không khớp với người dùng.' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công.' });
  } catch (error) {
    console.error('Lỗi khi thay đổi mật khẩu:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi thay đổi mật khẩu.' });
  }
};

const forgotPassword = async (req, res) => {
  const { phoneNumber, newPassword } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'Số điện thoại không tồn tại.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công.' });
  } catch (error) {
    console.error('Lỗi khi cập nhật mật khẩu:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật mật khẩu.' });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Không có người dùng nào.' });
    }
    res.status(200).json({ message: 'Danh sách người dùng', users });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách người dùng.' });
  }
};

// const getAllUserByAdmin = async (req, res) => {
//   try {
//     const users = await User.find({ role: { $ne: 'Admin' } });
//     res.status(200).json({ users });

//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// }

const getAllUserByAdmin = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } });
    const buses = await Bus.find(); 
    const busRoutes = await BusRoute.find();
    const trips = await Trips.find(); 
    const bookings = await Booking.find().populate("tripId"); 

    res.status(200).json({
      users,
      buses,
      busRoutes,
      trips,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};



const creatUserByAdmin = async (req, res) => {
  const { fullName, email, password, phoneNumber, role } = req.body;
  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Số điện thoại đã được sủ dụng.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role
    });
    await newUser.save();
    res.status(200).json({ message: 'Người dùng đã được tạo thành công!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo tài khoản.' });
  }
}
const updateUserByAdmin = async (req, res) => {
  const { id } = req.params; 
  const { fullName, email, password, phoneNumber, role } = req.body;

  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    const userWithPhone = await User.findOne({ phoneNumber });
    if (userWithPhone && userWithPhone._id.toString() !== id) {
      return res.status(400).json({ message: 'Số điện thoại đã được sử dụng bởi người dùng khác.' });
    }
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail && userWithEmail._id.toString() !== id) {
      return res.status(400).json({ message: 'Email đã được sử dụng bởi người dùng khác.' });
    }
    existingUser.fullName = fullName || existingUser.fullName;
    existingUser.email = email || existingUser.email;
    existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
    existingUser.role = role || existingUser.role;
    if (password) {
      existingUser.password = await bcrypt.hash(password, 10);
    }
    await existingUser.save();
    res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công!', user: existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
  }
};
const deleteUserByAdmin = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    res.status(200).json({ message: 'Người dùng đã được xóa thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa người dùng.' });
  }
};




module.exports = { createUser, checkPhoneNumberExists, loginUser, updateUser, updateAvatarMobile, forgotPassword, changePassword, getAllUser, getAllUserByAdmin, creatUserByAdmin ,updateUserByAdmin,deleteUserByAdmin};