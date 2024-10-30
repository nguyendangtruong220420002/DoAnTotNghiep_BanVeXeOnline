const express = require('express');
const router = express.Router();
const userRoutes = require('../../src/routes/userRoutes');
const busRoutes = require('../../src/routes/busRoutes');
// Định nghĩa routes ở đây
router.get('/', (req, res) => {
  res.send('API root');
});

// Sử dụng routes người dùng
router.use('/users', userRoutes);

// Routes quản lý xe buýt
router.use('/buses', busRoutes);

module.exports = router;