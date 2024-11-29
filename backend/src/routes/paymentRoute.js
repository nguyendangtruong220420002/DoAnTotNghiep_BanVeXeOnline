const express = require('express');
const router = express.Router();
const { processPayment, PaymetCancel, PaymetSuccess} = require('../controllers/paymentController');

router.post('/add', processPayment);
router.get('/cancel', PaymetCancel);
router.get('/success', PaymetSuccess);



module.exports = router;