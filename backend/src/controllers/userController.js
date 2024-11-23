const User = require('../../src/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
//const { upload } = require('../../src/config/s3');

// Đăng ký người dùng
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
// Check xem sdt có tồn tại không
const checkPhoneNumberExists = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(200).json({ exists: true, message: "Số điện thoại đã tồn tại." , user:user});
    }

    return res.status(201).json({ exists: false, message: "Số điện thoại không tồn tại." });

  } catch (error) {   
    return res.status(500).json({ message: "Lỗi khi kiểm tra số điện thoại.", error });
  }
};

//  // Đăng nhập người dùng
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

    // Tạo token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Trả về cả token và thông tin người dùng
    res.status(200).json({ message: 'Đăng nhập thành công!', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập.' });
  }
};


// Cập nhật thông tin người dùng với ảnh
const updateUser = async (req, res) => {
 // console.log('Hàm updateUser được gọi'); 
  //console.log('req.body:', req.body);
  const userId = req.params.id; 

  try {
    // Kiểm tra req.file có tồn tại không
    //console.log('req.file:', req.file);

    // Nếu có file được upload, lấy URL của file
    const img = req.file ? req.file.location : undefined;
    //console.log('Đường dẫn ảnh:', img);

    // Kiểm tra userId
    const userId = req.params.id; // Đảm bảo bạn có userId
   // console.log('User ID:', userId);

    // Cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(userId, {
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        img: img, // Cập nhật URL ảnh nếu có
    }, { new: true }); 

    // Kiểm tra xem người dùng có được cập nhật thành công không
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



module.exports = { createUser,checkPhoneNumberExists, loginUser,updateUser  };