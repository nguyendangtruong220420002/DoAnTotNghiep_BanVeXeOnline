const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const processPayment = async (req, res) => {
    const { bookingId, paymentMethod, amountPaid, paymentTransactionId } = req.body;
  
    // Kiểm tra xem booking có tồn tại không
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send('Không tìm thấy booking.');
    }
  
    // Tạo thông tin thanh toán
    const payment = new Payment({
      bookingId,
      paymentMethod,
      amountPaid,
      paymentTransactionId,
      paymentStatus: amountPaid >= booking.totalFare ? 'Thành công' : 'Thất bại', 
    });
  
    await payment.save();
    booking.paymentStatus = payment.paymentStatus;
    await booking.save();
  
    res.status(201).send(payment);
  };
  
  module.exports = {  processPayment };