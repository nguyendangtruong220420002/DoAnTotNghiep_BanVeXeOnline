const express = require('express');
const router = express.Router();

// Định nghĩa routes ở đây
router.get('/', (req, res) => {
  res.send('API root');
});

module.exports = router;