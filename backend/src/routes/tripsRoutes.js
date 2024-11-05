const express = require('express');
const router = express.Router();
const {  addTrips, getTripsByUser, editTrips, deleteTrips  } = require('../controllers/tripsController');

router.post('/add', addTrips);
router.get('/list',  getTripsByUser);
router.put('/update/:id', editTrips);
router.delete('/delete/:id', deleteTrips);

module.exports = router;