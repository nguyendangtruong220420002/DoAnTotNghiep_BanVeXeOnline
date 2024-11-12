const express = require('express');
const router = express.Router();
const {  addTrips, getTripsByUser, editTrips, deleteTrips, getTripsSeach,updateTripSchedule ,deleteTripSchedule} = require('../controllers/tripsController');

router.post('/add', addTrips);
router.get('/list',  getTripsByUser);
router.put('/update/:id', editTrips);
router.delete('/delete/:id', deleteTrips);
router.get('/search', getTripsSeach);
router.put('/update-schedule/:tripId', updateTripSchedule);
router.delete('/trip/:tripId/schedule', deleteTripSchedule);






module.exports = router;