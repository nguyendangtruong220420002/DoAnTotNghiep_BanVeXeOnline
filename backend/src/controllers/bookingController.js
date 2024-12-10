const Booking = require('../models/Booking');
const Trips = require('../models/Trips');
let sharedBookingID = null;
const createBooking = async (req, res) => {
  const { 
    tripId, userId, seatId, totalFare, selectedDepartureName, selectedDestinationName, Timehouse, departureDate, passengerInfo 
  } = req.body;

  const lastBooking = await Booking.findOne().sort({ BookingID: -1 });
  const newBookingID = lastBooking ? Math.max(lastBooking.BookingID + 1, 330) : 330;
  sharedBookingID = newBookingID;

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

  setTimeout(async () => {
    const currentBooking = await Booking.findById(booking._id);
    if (currentBooking.paymentStatus === 'Đang chờ thanh toán') {
      currentBooking.paymentStatus = 'Thanh toán không thành công';
      await currentBooking.save();

      const currentTrip = await Trips.findById(tripId);
      currentTrip.tripDates.forEach(date => {
        date.bookedSeats.booked = date.bookedSeats.booked.filter(seat => seat.seatId !== seatId);
      });
      await currentTrip.save();
    }
  }, 5 * 60 * 1000); // 5 phút

  res.status(201).send({ message: 'Đặt vé thành công', booking });
};

const createBookingRoutTrip = async (req, res) => {
  const { 
    userId, passengerInfo, tripId, selectedDepartureName, selectedDestinationName, seatId, Timehouse, totalFare, departureDate 
  } = req.body;

  const tripReturn = await Trips.findById(tripId);
  if (tripReturn.bookedSeats && tripReturn.bookedSeats.some(seat => seat.seatId === seatId)) {
    return res.status(400).send('Ghế đã được đặt cho chuyến đi về');
  }

  const bookingReturn = new Booking({
    BookingID: sharedBookingID,
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

  await bookingReturn.save();

  setTimeout(async () => {
    const currentBooking = await Booking.findById(bookingReturn._id);
    if (currentBooking.paymentStatus === 'Đang chờ thanh toán') {
      currentBooking.paymentStatus = 'Thanh toán không thành công';
      await currentBooking.save();

      const currentTrip = await Trips.findById(tripId);
      currentTrip.tripDates.forEach(date => {
        date.bookedSeats.booked = date.bookedSeats.booked.filter(seat => seat.seatId !== seatId);
      });
      await currentTrip.save();
    }
  }, 5 * 60 * 1000); // 5 phút

  res.status(201).send({ message: 'Đặt vé thành công', bookingReturn });
};

const getBookingByUser = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(201).json('Thiếu userId.');;
  }
  try {
    const bookings = await Booking.find({
      userId,
      paymentStatus: { $ne: 'Đang chờ thanh toán' }
    }).sort({ createdAt: -1 }).populate({
      path: 'tripId',              
      select: 'busId',          
      populate: {
        path: 'busId',            
        select: 'busName licensePlate busType cartSeat Price' 
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

module.exports = { createBooking, getBookingByUser, getBookingByUserId,createBookingRoutTrip };