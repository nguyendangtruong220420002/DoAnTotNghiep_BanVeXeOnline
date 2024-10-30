const express = require('express');
const router = express.Router();
const { addBus, getBusesByUser, editBus, deleteBus } = require('../controllers/busController');


// Route thêm xe buýt
router.post('/add', addBus);
// Lấy danh sách xe buýt của người dùng đã đăng nhập
router.get('/list',  getBusesByUser);
//Sửa xe buýt
router.put('/update/:id', editBus);
// Route xóa xe buýt
router.delete('/delete/:id', deleteBus);

module.exports = router;