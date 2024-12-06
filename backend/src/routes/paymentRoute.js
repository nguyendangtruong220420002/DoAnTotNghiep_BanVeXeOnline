const express = require('express');
const router = express.Router();
const { processPayment, PaymetCancel, PaymetSuccess, getOrderfromPayOS,} = require('../controllers/paymentController');

router.post('/add', processPayment);
router.get('/getOrder', getOrderfromPayOS);
router.get('/cancel', PaymetCancel);
router.get('/success', PaymetSuccess);





module.exports = router;