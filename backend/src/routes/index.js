const express = require('express');
const router = express.Router();
const userRoutes = require('../../src/routes/userRoutes');
const busRoutes = require('../../src/routes/busRoutes');
const addBusRoute = require('../../src/routes/busRouteRoutes');
const addTripsRoute = require('../../src/routes/tripsRoutes');
const addBookingRoute = require('../../src/routes/bookingRoute');
const addPaymentRoute = require('../../src/routes/paymentRoute');
const revenueRoute = require('../../src/routes/revenueRoute');

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

// Routes quản lý hóa đơn khách hàng
router.use('/bookingRoutes', addBookingRoute);

// Routes quản lý Thanh toán khcacsh hàng
router.use('/addPaymentRoute', addPaymentRoute);

router.use('/revenue', revenueRoute)


module.exports = router;