const express = require('express');
const router = express.Router();
const {  addTrips, getTripsByUser, editTrips, deleteTrips, getTripsSeach,updateTripSchedule ,deleteTripSchedule,addTicket ,editTicket,} = require('../controllers/tripsController');
const { bookSeats, getBookedSeats,bookSeatsRoutTrip} = require('../controllers/seatsController');

router.post('/add', addTrips);
router.get('/list',  getTripsByUser);
router.put('/update/:id', editTrips);
router.delete('/delete/:id', deleteTrips);
router.get('/search', getTripsSeach);
router.put('/update-schedule/:tripId', updateTripSchedule);
//lịch trình
router.delete('/trip/:tripId/schedule', deleteTripSchedule);
// đặt ghế
router.post('/book-seats', bookSeats);
router.post('/book-SeatsRoutTrip', bookSeatsRoutTrip);
router.get('/getBooked-seats', getBookedSeats);
router.post('/addTicket', addTicket);
router.put('/editTicket/:id', editTicket);



module.exports = router;