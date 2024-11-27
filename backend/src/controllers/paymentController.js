const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const axios = require('axios');
const PayOS = require('@payos/node');

// const CLIENT_ID = process.env.CLIENT_ID;
// const API_KEY = process.env.API_KEY;
// const CHECKSUM_KEY = process.env.CHECKSUM_KEY;


const processPayment = async (req, res) => {
  try {
    const { bookingId,bookingID, paymentMethod, totalAmountAll,SeatCode } = req.body;
    const amount = totalAmountAll; 
    const orderCode = bookingID;
    const returnUrl = 'https://yourwebsite.com/payment/success';  // Thay thế URL này với URL thành công thực tế
    const cancelUrl = 'https://yourwebsite.com/payment/cancel';  // Thay thế URL này với URL hủy thực tế
    const description = `Thanh toán vé xe ${SeatCode}`.slice(0, 25); 

    const order ={
      orderCode:orderCode,
      amount:amount,
      description:description,
      returnUrl:returnUrl ,
      cancelUrl:cancelUrl ,

    };
    const paymentLink = await payos.createPaymentLink(order);
    res.json({ checkoutUrl: paymentLink.checkoutUrl });
   
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Lỗi khi xử lý thanh toán.');
  }
};

module.exports = { processPayment };