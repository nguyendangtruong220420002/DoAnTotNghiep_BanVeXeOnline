const User = require('../../src/models/User');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;

  try {
    // Kiểm tra nếu người dùng đã tồn tại
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Số điện thoại đã được sủ dụng.' });
    }
    // Băm mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
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
      return res.status(200).json({ exists: true, message: "Số điện thoại đã tồn tại." });
    }

    return res.status(200).json({ exists: false, message: "Số điện thoại không tồn tại." });

  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi kiểm tra số điện thoại.", error });
  }
};

module.exports = { createUser,checkPhoneNumberExists };