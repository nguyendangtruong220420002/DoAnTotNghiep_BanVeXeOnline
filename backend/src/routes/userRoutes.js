const express = require('express');
const router = express.Router();
const { createUser, checkPhoneNumberExists, loginUser, updateUser, updateAvatarMobile, changePassword } = require('../controllers/userController')
const authenticateToken = require('../../src/middlewares/authenticateToken');
const { upload } = require('../config/s3');

// Route tạo người dùng
router.post('/', createUser);

// Route check sdt tồn tại
router.post('/check-phone', checkPhoneNumberExists);

// Route đăng nhập người dùng
router.post('/login', loginUser);


// // Route cập nhật thông tin người dùng với upload ảnh
router.put('/:id', authenticateToken, upload.single('img'), updateUser);
// 
router.put("/update-avatar-mobile/:id", updateAvatarMobile);

router.post("/change-password/:id", changePassword);


module.exports = router;