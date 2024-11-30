const Booking = require('../models/Booking');
const Trips = require('../../src/models/Trips');
const axios = require('axios');
const PayOS = require('@payos/node');

// const CLIENT_ID = process.env.CLIENT_ID;
// const API_KEY = process.env.API_KEY;
// const CHECKSUM_KEY = process.env.CHECKSUM_KEY;
const API_URL = 'http://127.0.0.1:5173';
const payos = new PayOS('3e15d73c-23ac-4888-950e-21c830060668','dc5be5a7-8c48-4376-9a9d-57640516cbdc','eeb3ba38a4c869f20ddbcd7e7108201ec7eb7913bd6569c9f95040b6617ed2f5');

const processPayment = async (req, res) => {
  try {
    const { bookingId,bookingID, totalAmountAll,SeatCode ,business ,  dataOfShowTrips,InforCusto,} = req.body;
    const amount = totalAmountAll; 
    const orderCode = bookingID;
    const returnUrl = `${API_URL}/paymentSuccess?bookingId=${bookingId}&dataOfShowTrips=${encodeURIComponent(JSON.stringify(dataOfShowTrips))}&InforCusto=${encodeURIComponent(JSON.stringify(InforCusto))}`;  
    // const cancelUrl = `${API_URL}/paymentCancel?bookingId=${bookingId}`;
    const cancelUrl = `${API_URL}/paymentCancel?bookingId=${bookingId}&dataOfShowTrips=${encodeURIComponent(JSON.stringify(dataOfShowTrips))}&InforCusto=${encodeURIComponent(JSON.stringify(InforCusto))}`;

    const description = `Mhd${bookingID} Vé${SeatCode} Xe${business} `.slice(0, 25); 

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

const PaymetCancel = async (req, res) => {
  try {
    const { bookingId } = req.query;
    console.log("bookingId",bookingId);

    if (!bookingId || typeof bookingId !== 'string') {
      return res.status(400).json({ message: 'Booking ID không hợp lệ.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking.' });
    }

    const { tripId, seatId } = booking;

    booking.paymentStatus = 'Thanh toán không thành công';
    await booking.save();

    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến đi.' });
    }

    trip.tripDates.forEach((date) => {
      date.bookedSeats.booked = date.bookedSeats.booked.filter(
        (seat) => !seatId.includes(seat.seatId)
      );
    });
    await trip.save();
    res.json({ status: 'cancelled', message: 'Hủy thanh toán thành công.' });
  } catch (error) {
    console.error('Error processing cancellation:', error);
    res.status(500).json({ error: error.message });
  }
};

const PaymetSuccess = async (req, res) => {
  try {
    const { bookingId } = req.query;
    console.log("bookingId",bookingId);

    if (!bookingId || typeof bookingId !== 'string') {
      return res.status(400).json({ message: 'Booking ID không hợp lệ.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking.' });
    }

    const { tripId, seatId } = booking;

    booking.paymentStatus = 'Đã thanh toán';
    await booking.save();

    const trip = await Trips.findById(tripId);
if (!trip) {
  return res.status(404).json({ message: 'Không tìm thấy chuyến đi.' });
}

trip.tripDates.forEach((date) => {
  date.bookedSeats.booked = date.bookedSeats.booked.map((seat) => {
    if (seatId.includes(seat.seatId)) {
      seat.status = 'Đã thanh toán'; 
    }
    return seat;
  });
});

await trip.save();
    res.json({ status: 'success', message: ' Thanh toán thành công.' });
  } catch (error) {
    console.error('Error processing cancellation:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processPayment, PaymetCancel, PaymetSuccess};