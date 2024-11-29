const express = require('express');
const router = express.Router();
const { createBooking, getBookingByUser } = require('../controllers/bookingController');

router.post('/add', createBooking);
router.get('/getBookingByUser', getBookingByUser);


module.exports = router;