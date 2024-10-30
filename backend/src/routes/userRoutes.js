const express = require('express');
const router = express.Router();
const { createUser, checkPhoneNumberExists, loginUser, updateUser } = require('../controllers/userController')
const authenticateToken = require('../../src/middlewares/authenticateToken');
const { upload } = require('../../src/config/s3');

// Route tạo người dùng
router.post('/', createUser);

// Route check sdt tồn tại
router.post('/check-phone', checkPhoneNumberExists);

// Route đăng nhập người dùng
router.post('/login', loginUser);


// // Route cập nhật thông tin người dùng với upload ảnh
 router.put('/:id', authenticateToken, upload.single('img'), updateUser); 



module.exports = router;