const express = require('express');
const router = express.Router();
const { verifyOtp } = require('../controllers/verifyOtpController')

// Định nghĩa routes ở đây
router.get('/', (req, res) => {
  res.send('API root');
});

router.post('/auth/verify-otp', verifyOtp);

module.exports = router;