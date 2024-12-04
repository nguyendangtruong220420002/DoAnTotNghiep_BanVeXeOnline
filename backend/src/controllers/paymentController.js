const Booking = require('../models/Booking');
const Trips = require('../../src/models/Trips');
const axios = require('axios');
const PayOS = require('@payos/node');
const moment = require('moment-timezone');

const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;
const CHECKSUM_KEY = process.env.CHECKSUM_KEY;

const API_URL = 'https://doantotnghiep-banvexeonline.onrender.com';

const payos = new PayOS(CLIENT_ID, API_KEY, CHECKSUM_KEY);

const processPayment = async (req, res) => {
  try {
    const { bookingId, bookingID, totalAmountAll, SeatCode, business, dataOfShowTrips, InforCusto, tripId, departureDate } = req.body;
    const amount = totalAmountAll; 
    const orderCode = bookingID;
    const returnUrl = `${API_URL}/paymentSuccess?bookingId=${bookingId}&dataOfShowTrips=${encodeURIComponent(JSON.stringify(dataOfShowTrips))}&InforCusto=${encodeURIComponent(JSON.stringify(InforCusto))}`;  
    // const cancelUrl = `${API_URL}/paymentCancel?bookingId=${bookingId}`;
    const cancelUrl = `${API_URL}/paymentCancel?bookingId=${bookingId}&tripId=${tripId}&departureDate=${departureDate}&dataOfShowTrips=${encodeURIComponent(JSON.stringify(dataOfShowTrips))}&InforCusto=${encodeURIComponent(JSON.stringify(InforCusto))}`;
    const description = `Mhd${bookingID} Vé${SeatCode} Xe${business} `.slice(0, 25); 

    const order = {
      orderCode: orderCode,
      amount: amount,
      description: description,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
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
    console.log("bookingId", bookingId);

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
    console.log("bookingId", bookingId);

    if (!bookingId || typeof bookingId !== 'string') {
      return res.status(400).json({ message: 'Booking ID không hợp lệ.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking.' });
    }

    const { tripId, seatId, bookingDate } = booking;

    booking.paymentStatus = 'Đã thanh toán';
    await booking.save();

    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến đi.' });
    }
    const tripDate = trip.tripDates.find((td) =>
      moment(td.date).tz('Asia/Ho_Chi_Minh').isSame(moment(bookingDate), 'day')
    );

    if (!tripDate) {
      return res.status(404).json({ message: 'Ngày chuyến đi không hợp lệ.' });
    }
    tripDate.bookedSeats.booked = tripDate.bookedSeats.booked.map((seat) => {
      if (seatId.includes(seat.seatId)) {
        seat.status = 'Đã thanh toán';
      }
      return seat;
    });
    const paidSeats = tripDate.bookedSeats.booked.filter(
      (seat) => seat.status === 'Đã thanh toán'
    );
    const newSeatsBooked = paidSeats.length;

    const ticketPrice = trip.totalFareAndPrice || 0;
    tripDate.sales.totalTicketsSold = newSeatsBooked;
    tripDate.sales.totalRevenue = tripDate.sales.totalTicketsSold * ticketPrice;

    await trip.save();

    res.json({ status: 'success', message: 'Thanh toán thành công.' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderfromPayOS = async (req, res) => {
  try {
    const bookingID = req.query?.bookingID;
    const orderCode = bookingID;

    console.log(bookingID);

    if (!orderCode) {
      res.status(201).send('OrderCode rỗng ! ');
    } else {
      await payos.getPaymentLinkInformation(orderCode)
        .then((orderInfo) => {
          if (orderInfo) {
            res.status(200).json({ orderInfo: orderInfo });
          } else {
            res.status(401).send("Không tìm thấy thông tin thanh toán");
          }
          console.log('Order Information:', orderInfo);
        })
        .catch((error) => {
          console.error('Error fetching order information:', error);
        });
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Lỗi lấy thông tin thanh toán.');
  }
}


module.exports = { processPayment, PaymetCancel, PaymetSuccess, getOrderfromPayOS };