const express = require('express');
const { getRevenueByBooking, getRevenueByAdmin } = require('../controllers/RevenueController');
const router = express.Router();

router.get('/getRevenue/:id', getRevenueByBooking);
router.get('/get-renvenue-by-admin', getRevenueByAdmin);

module.exports = router;