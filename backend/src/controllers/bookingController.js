const Booking = require('../models/Booking');
const Trips = require('../models/Trips');
const Bull = require('bull');
const Redis = require('ioredis');
const redis = new Redis();
require('dotenv').config();
const paymentQueue = new Bull('paymentQueue', {
  // redis: { host: 'localhost', port: 6379 } 
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    //password: process.env.REDIS_PASSWORD
  }
  
});
redis.ping().then(() => {
  console.log('Connected to Redis successfully!');
}).catch(err => {
  console.error('Error connecting to Redis:', err);
});
// console.log("process.env.REDIS_HOST",process.env.REDIS_HOST);
//   console.log(" process.env.REDIS_PORT",process.env.REDIS_PORT);
paymentQueue.process(async (job) => {
  const { bookingId, tripId, seatId } = job.data;
  const booking = await Booking.findById(bookingId);
  if (booking.paymentStatus === 'Đang chờ thanh toán') {
    booking.paymentStatus = 'Thanh toán không thành công';
    console.log("Updated paymentStatus:", booking.paymentStatus);
    await booking.save();
    const trip = await Trips.findById(tripId);
    trip.tripDates.forEach(date => {
      const initialBookedSeatsLength = date.bookedSeats.booked.length;
      date.bookedSeats.booked = date.bookedSeats.booked.filter(seat => seat.seatId !== seatId);
      if (date.bookedSeats.booked.length < initialBookedSeatsLength) {
        console.log(`Ghế với seatId: ${seatId} đã được xóa thành công.`);
      }
    });
    await trip.save();
  }
});

const createBooking = async (req, res) => {

  const { tripId, userId, seatId, totalFare, selectedDepartureName, selectedDestinationName, Timehouse, departureDate, passengerInfo } = req.body;

  if (!tripId || !userId || !seatId || !totalFare || !passengerInfo) {
    return res.status(400).send('Thiếu dữ liệu yêu cầu.');
  }

  const lastBooking = await Booking.findOne().sort({ BookingID: -1 });
  const newBookingID = lastBooking ? lastBooking.BookingID + 1 : 1;
  const trip = await Trips.findById(tripId);

  if (trip.bookedSeats && trip.bookedSeats.some(seat => seat.seatId === seatId)) {
    return res.status(400).send('Ghế đã được đặt');
  }

  const booking = new Booking({
    BookingID: newBookingID,
    tripId,
    userId,
    seatId,
    totalFare,
    selectedDepartureName,
    selectedDestinationName,
    Timehouse,
    departureDate,
    paymentStatus: 'Đang chờ thanh toán',
    passengerInfo: {
      fullName: passengerInfo.fullName,
      phoneNumber: passengerInfo.phoneNumber,
      email: passengerInfo.email
    }
  });

  await booking.save();

  paymentQueue.add({
    bookingId: booking._id,
    tripId,
    seatId
  }, {
    delay: 5 * 60 * 1000
  });
  res.status(201).send(booking);
};

// const createBooking = async (req, res) => {
//   const { tripId, userId, seatId, totalFare, selectedDepartureName, selectedDestinationName, Timehouse, departureDate, passengerInfo } = req.body;
//   if (!tripId || !userId || !seatId || !totalFare || !passengerInfo) {
//     return res.status(400).send('Thiếu dữ liệu yêu cầu.');
//   }
//   const lastBooking = await Booking.findOne().sort({ BookingID: -1 });
//   console.log("lastBooking", lastBooking);
//   const newBookingID = lastBooking ? lastBooking.BookingID + 1 : 1;
//   console.log("newBookingID", newBookingID);
//   const trip = await Trips.findById(tripId);
//   if (trip.bookedSeats && trip.bookedSeats.some(seat => seat.seatId === seatId)) {
//     return res.status(400).send('Ghế đã được đặt');
//   }
//   const booking = new Booking({
//     BookingID: newBookingID,
//     tripId,
//     userId,
//     seatId,
//     totalFare,
//     selectedDepartureName,
//     selectedDestinationName,
//     Timehouse,
//     departureDate,
//     paymentStatus: 'Đang chờ thanh toán',
//     passengerInfo: {
//       fullName: passengerInfo.fullName,
//       phoneNumber: passengerInfo.phoneNumber,
//       email: passengerInfo.email
//     }
//   });
//   // console.log("booking", booking);
//   await booking.save();

//   setTimeout(async () => {
//     const updatedBooking = await Booking.findById(booking._id);
//     if (updatedBooking.paymentStatus === 'Đang chờ thanh toán') {
//       updatedBooking.paymentStatus = 'Thanh toán không thành công';
//       await updatedBooking.save();
//       const trip = await Trips.findById(tripId);
//       console.log("Trips", tripId);

//       trip.tripDates.forEach(date => {
//         const initialBookedSeatsLength = date.bookedSeats.booked.length;
//         date.bookedSeats.booked = date.bookedSeats.booked.filter(seat =>
//           seat.seatId !== seatId
//         );
//         if (date.bookedSeats.booked.length < initialBookedSeatsLength) {
//           console.log(`Ghế với seatId: ${seatId} đã được xóa thành công.`);
//         }
//       });
//       await trip.save();
//     }
//   }, 5 * 60 * 1000);

//   res.status(201).send(booking);
// };

const getBookingByUser = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(201).json('Thiếu userId.');;
  }
  try {


    // Tìm tất cả các booking theo userId
    const bookings = await Booking.find({
      userId,
      paymentStatus: { $ne: 'Đang chờ thanh toán' }
    }).sort({ createdAt: -1 }).populate({
      path: 'tripId',               // Dẫn đến trường tripId trong Booking
      select: 'busId',               // Chọn chỉ busId từ Trip
      populate: {
        path: 'busId',              // Dẫn đến trường busId trong Trip
        select: 'busName licensePlate busType cartSeat Price' // Chọn các trường bạn muốn lấy từ Bus
      }
    });

    if (bookings.length === 0) {
      return res.status(404).send('Không tìm thấy booking nào cho người dùng này.');
    }

    res.status(200).json(bookings);

  } catch (error) {
    console.error(error);
    res.status(500).send('Đã xảy ra lỗi khi truy vấn dữ liệu.');
  }

}
const getBookingByUserId = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(201).json('Thiếu userId.');
  }

  try {
    const bookings = await Booking.find({ userId }).populate('tripId')
      .populate({
        path: 'tripId', populate: { path: 'userId', select: 'fullName phoneNumber', }
        ,
      })
      .populate({
        path: 'tripId', populate: { path: 'routeId', select: 'departure destination', }
        ,
      })
      .exec();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Đã xảy ra lỗi khi truy vấn dữ liệu.');
  }
}

module.exports = { createBooking, getBookingByUser, getBookingByUserId };