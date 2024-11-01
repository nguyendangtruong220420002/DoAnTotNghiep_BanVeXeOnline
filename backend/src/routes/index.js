const express = require('express');
const router = express.Router();
const userRoutes = require('../../src/routes/userRoutes');
const busRoutes = require('../../src/routes/busRoutes');
const addBusRoute = require('../../src/routes/busRouteRoutes');
const addTripsRoute = require('../../src/routes/tripsRoutes');
// Định nghĩa routes ở đây
router.get('/', (req, res) => {
  res.send('API root');
});

// Sử dụng routes người dùng
router.use('/users', userRoutes);

// Routes quản lý xe 
router.use('/buses', busRoutes);

// Routes quản lý tuyến xe
router.use('/busRoutes', addBusRoute);

// Routes quản lý chuyến xe
router.use('/tripsRoutes', addTripsRoute);

module.exports = router;