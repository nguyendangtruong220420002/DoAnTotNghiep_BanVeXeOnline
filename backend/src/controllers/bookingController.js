const Booking = require('../models/Booking');
const Trips = require('../models/Trips');

const createBooking = async (req, res) => {
  const { tripId, userId, seatId, totalFare, selectedDepartureName, selectedDestinationName, Timehouse, departureDate, passengerInfo } = req.body;
  if (!tripId || !userId || !seatId || !totalFare || !passengerInfo) {
    return res.status(400).send('Thiếu dữ liệu yêu cầu.');
  }

  const lastBooking = await Booking.findOne().sort({ BookingID: -1 });
  console.log("lastBooking", lastBooking);
  const newBookingID = lastBooking ? lastBooking.BookingID + 1 : 1;
  console.log("newBookingID", newBookingID);
  const trip = await Trips.findById(tripId);
  if (trip.bookedSeats && trip.bookedSeats.some(seat => seat.seatId === seatId)) {
    return res.status(400).send('Ghế đã được đặt');
  }



  // Tạo booking
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
  console.log("booking", booking)

  // Lưu booking vào database
  await booking.save();

  setTimeout(async () => {
    const updatedBooking = await Booking.findById(booking._id);

    // Nếu thanh toán chưa thành công sau 5 phút
    if (updatedBooking.paymentStatus === 'Đang chờ thanh toán') {
      updatedBooking.paymentStatus = 'Thanh toán không thành công';
      await updatedBooking.save();
      const trip = await Trips.findById(tripId);
      console.log("Trips", tripId);


      trip.tripDates.forEach(date => {
        const initialBookedSeatsLength = date.bookedSeats.booked.length;
        date.bookedSeats.booked = date.bookedSeats.booked.filter(seat =>
          seat.seatId !== seatId
        );

        if (date.bookedSeats.booked.length < initialBookedSeatsLength) {
          console.log(`Ghế với seatId: ${seatId} đã được xóa thành công.`);
        }
      });
      await trip.save();
    }
  }, 5 * 60 * 1000);

  res.status(201).send(booking);
};

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
module.exports = { createBooking, getBookingByUser };