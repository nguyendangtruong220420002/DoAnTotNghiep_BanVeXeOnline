const express = require('express');
const router = express.Router();
const { createBooking, getBookingByUser,getBookingByUserId ,createBookingRoutTrip} = require('../controllers/bookingController');

router.post('/add', createBooking);
router.post('/addRoutTrip', createBookingRoutTrip);
router.get('/getBookingByUser', getBookingByUser);
router.get('/getBookingByUserId', getBookingByUserId);


module.exports = router;