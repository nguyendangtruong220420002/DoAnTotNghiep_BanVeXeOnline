const Booking = require('../models/Booking');
const Trips = require('../models/Trips');

const createBooking = async (req, res) => {
  const { tripId, userId, seatId, totalFare,selectedDepartureName,selectedDestinationName,Timehouse,departureDate, passengerInfo } = req.body;
  if (!tripId || !userId || !seatId || !totalFare || !passengerInfo) {
    return res.status(400).send('Thiếu dữ liệu yêu cầu.');
  }
  const lastBooking = await Booking.findOne().sort({ BookingID: -1 });
  console.log("lastBooking", lastBooking);
  const newBookingID = lastBooking ? lastBooking.BookingID + 1 : 1;
  console.log("newBookingID",newBookingID);
  const trip = await Trips.findById(tripId);
  if (trip.bookedSeats && trip.bookedSeats.some(seat => seat.seatId === seatId)) {
    return res.status(400).send('Ghế đã được đặt');
  }
  const booking = new Booking({
    BookingID:newBookingID,
    tripId,
    userId,
    seatId,
    totalFare,
    selectedDepartureName,
    selectedDestinationName,
    Timehouse,
    departureDate,
    paymentStatus:'Đang chờ thanh toán',
    passengerInfo: {
      fullName:passengerInfo.fullName,  
      phoneNumber:passengerInfo.phoneNumber,
      email:passengerInfo.email
    }
    });
    console.log("booking",booking)
  await booking.save();

  setTimeout(async () => {
    const updatedBooking = await Booking.findById(booking._id);
  
    // Nếu thanh toán chưa thành công sau 5 phút
    if (updatedBooking.paymentStatus === 'Đang chờ thanh toán') {
      updatedBooking.paymentStatus = 'Thanh toán không thành công';
      await updatedBooking.save();
      const trip = await Trips.findById(tripId);
      console.log("Trips",tripId);
      
  
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



module.exports = {createBooking };