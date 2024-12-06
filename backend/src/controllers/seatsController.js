const Trips = require('../../src/models/Trips');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

const bookSeats = async (req, res) => {
  try {
    const { tripId, bookingDate, seats, userId } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để đặt vé.Vui lòng đăt nhập lại !!!" });
    }
    if (!Array.isArray(seats)) {
      return res.status(400).json({ message: "Dữ liệu ghế không hợp lệ. Vui lòng chọn lại ghế." });
    }
    console.log("Received Data:", { tripId, bookingDate, seats, userId });
    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "Bạn chưa chọn ghế." });
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
        bookingDate: new Date(),
        status: 'Đã đặt',
      });
    });
    await trip.save();
    // Emit event to notify clients about the booked seats
    res.status(200).json({
      message: "Đặt ghế thành công!",
      bookedSeats: tripDate.bookedSeats
    });

  } catch (error) {
    console.error("Error booking seats:", error);
    res.status(500).json({ message: "Không thể đặt ghế. Vui lòng thử lại sau." });
  }
};

const bookSeatsRoutTrip = async (req, res) => {
  try {
    const { tripId, bookingDate, seats, userId, } = req.body;
    console.log("tripId",tripId);
    console.log("bookingDate",bookingDate);
    console.log("seats",seats);
    console.log("userId",userId);
    if (!userId) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để đặt vé.Vui lòng đăt nhập lại !!!" });
    }
    if (!Array.isArray(seats)) {
      return res.status(400).json({ message: "Dữ liệu ghế không hợp lệ. Vui lòng chọn lại ghế." });
    }
    console.log("Received Data:", { tripId, bookingDate, seats, userId });
    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "Bạn chưa chọn ghế chuyến về." });
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
        bookingDate: new Date(),
        status: 'Đã đặt',
      });
    });
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
    const filteredSeats = bookedSeats.filter(seat => seat.status !== 'Đã Hủy'); 
    res.status(200).json({
      message: "Danh sách ghế đã đặt",
  
    bookedSeats: filteredSeats .map(seat => ({
      seatId: seat.seatId,
      userId: seat.userId,
      bookingDate: seat.bookingDate,
      status: seat.status, 
    }))
  });

  } catch (error) {
    console.error("Error fetching booked seats:", error);
    res.status(500).json({ message: "Không thể lấy danh sách ghế đã đặt. Vui lòng thử lại sau." });
  }
};

const updateSeatStatus = async (tripId, seatIds, newStatus) => {
  const trip = await Trips.findById(tripId);
  if (!trip) {
    throw new Error('Chuyến đi không tồn tại');
  }

  const tripDate = trip.tripDates.find((td) =>
    moment(td.date).tz('Asia/Ho_Chi_Minh').isSame(new Date(), 'day')
  );

  if (!tripDate) {
    throw new Error('Ngày này không có sẵn cho chuyến xe');
  }

  seatIds.forEach((seatId) => {
    const seat = tripDate.bookedSeats.booked.find(s => s.seatId === seatId);
    if (seat) {
      seat.status = newStatus; 
    }
  });

  await trip.save();
};





module.exports = { bookSeats, getBookedSeats, updateSeatStatus,bookSeatsRoutTrip };