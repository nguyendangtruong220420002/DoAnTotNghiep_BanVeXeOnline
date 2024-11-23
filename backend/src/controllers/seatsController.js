const Trips = require('../../src/models/Trips');
const moment = require('moment-timezone');

const bookSeats = async (req, res) => {
  try {
    const { tripId, bookingDate, seats, userId } = req.body;
    if (!tripId || !bookingDate || !Array.isArray(seats) || seats.length === 0 || !userId) {
      return res.status(400).json({ message: "Thông tin đặt vé không đầy đủ" });
    }
    const formattedBookingDate = moment.tz(bookingDate, 'Asia/Ho_Chi_Minh').startOf('day');
    if (!formattedBookingDate.isValid()) {
      return res.status(400).json({ message: "Ngày đặt vé không hợp lệ" });
    }
    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Chuyến đi không tồn tại" });
    }
    const tripDate = trip.tripDates.find((td) =>
      moment(td.date).tz('Asia/Ho_Chi_Minh').isSame(formattedBookingDate, "day")
    );

    if (!tripDate) {
      return res.status(404).json({ message: "Ngày này không có sẵn cho chuyến xe" });
    }
    if (!tripDate.bookedSeats) {
      tripDate.bookedSeats = { booked: [] };
    }
    const bookedSeatIds = new Set(tripDate.bookedSeats.booked.map((seat) => seat.seatId));
    const conflictingSeats = seats.filter((seat) => bookedSeatIds.has(seat));

    if (conflictingSeats.length > 0) {
      return res.status(400).json({ 
        message: "Chỗ đã được đặt trước !!! Vui lòng chọn chỗ khác", 
        conflictingSeats 
      });
    }
    seats.forEach((seat) => {
      if (!seat || !userId) {
        return res.status(400).json({ message: "Ghế hoặc userId không hợp lệ" });
      }
      if (bookedSeatIds.has(seat)) {
        return res.status(400).json({ 
          message: `Ghế ${seat} đã được đặt trước, vui lòng chọn ghế khác.` 
        });
      }

      tripDate.bookedSeats.booked.push({
        seatId: seat,
        userId: userId,
        bookingDate: new Date() 
      });
    });

    const newSeatsBooked = seats.length;
    const ticketPrice = trip.totalFareAndPrice || 0;
    tripDate.sales.totalTicketsSold += newSeatsBooked;
    tripDate.sales.totalRevenue = tripDate.sales.totalTicketsSold * ticketPrice;
    await trip.save();
    res.status(200).json({ 
      message: "Đặt ghế thành công!", 
      bookedSeats: tripDate.bookedSeats 
    });

  } catch (error) {
    console.error("Error booking seats:", error);
    res.status(500).json({ message: "Không thể đặt ghế. Vui lòng thử lại sau." });
  }
};

const getBookedSeats = async (req, res) => {
  try {
    const { tripId, bookingDate } = req.query;
    //  console.log("tripId",tripId);
    // console.log("bookingDate",bookingDate);

    const trip = await Trips.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Chuyến đi không tồn tại" });
    }
    const formattedBookingDate = moment.tz(bookingDate, 'Asia/Ho_Chi_Minh').startOf('day');
    if (!formattedBookingDate.isValid()) {
      return res.status(400).json({ message: "Ngày đặt vé không hợp lệ" });
    }
    const tripDate = trip.tripDates.find((td) =>
      moment(td.date).tz('Asia/Ho_Chi_Minh').isSame(formattedBookingDate, 'day')
    );

    if (!tripDate) {
      return res.status(404).json({ message: "Ngày này không có sẵn cho chuyến xe" });
    }
    const bookedSeats = tripDate.bookedSeats ? tripDate.bookedSeats.booked : [];
    res.status(200).json({
      message: "Danh sách ghế đã đặt",
      bookedSeats: bookedSeats
    });

  } catch (error) {
    console.error("Error fetching booked seats:", error);
    res.status(500).json({ message: "Không thể lấy danh sách ghế đã đặt. Vui lòng thử lại sau." });
  }
};


  
 

  module.exports = { bookSeats ,getBookedSeats };