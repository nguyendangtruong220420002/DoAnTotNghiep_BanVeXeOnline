const express = require('express');
const router = express.Router();
const { createUser, checkPhoneNumberExists } = require('../controllers/userController')

// Route tạo người dùng
router.post('/', createUser);
router.post('/check-phone', checkPhoneNumberExists);

module.exports = router;