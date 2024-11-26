const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');

router.post('/add', createBooking);




module.exports = router;