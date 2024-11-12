const express = require('express');
const router = express.Router();
const { addBusRoute,getBusRoutesByUser,editBusRoute,deleteBusRoute } = require('../controllers/BusRouteController');

router.post('/add', addBusRoute);
router.get('/list',  getBusRoutesByUser);
router.put('/update/:id', editBusRoute);
router.delete('/delete/:id', deleteBusRoute);



module.exports = router;