const express = require('express');
const router = express.Router();
const userRoutes = require('../../src/routes/userRoutes');

// Định nghĩa routes ở đây
router.get('/', (req, res) => {
  res.send('API root');
});

// Sử dụng routes người dùng
router.use('/users', userRoutes);

module.exports = router;