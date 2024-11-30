const express = require('express');
const router = express.Router();
const { createBooking, getBookingByUser,getBookingByUserId} = require('../controllers/bookingController');

router.post('/add', createBooking);
router.get('/getBookingByUser', getBookingByUser);
router.get('/getBookingByUserId', getBookingByUserId);


module.exports = router;