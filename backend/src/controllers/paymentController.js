const Booking = require('../models/Booking');
const Trips = require('../../src/models/Trips');
const axios = require('axios');
const PayOS = require('@payos/node');
const moment = require('moment-timezone');

const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;
const CHECKSUM_KEY = process.env.CHECKSUM_KEY;

const API_URL = process.env.API_URL;

const payos = new PayOS(CLIENT_ID, API_KEY, CHECKSUM_KEY);

const processPayment = async (req, res) => {
  try {
    const { bookingId,bookingID, totalAmountAllTowTrips,SeatCode ,business , dataOfShowTrips,InforCusto,bookingId2} = req.body;
    //console.log("bookingID",bookingID);
    console.log("processPayment-bookingId2",bookingId2);
    const amount = totalAmountAllTowTrips; 
    const orderCode = bookingID;
    const returnUrl = `${API_URL}/paymentSuccess?bookingId=${bookingId}&bookingId2=${bookingId2}&dataOfShowTrips=${encodeURIComponent(JSON.stringify(dataOfShowTrips))}&InforCusto=${encodeURIComponent(JSON.stringify(InforCusto))}`;  
    const cancelUrl = `${API_URL}/paymentCancel?bookingId=${bookingId}&bookingId2=${bookingId2}&dataOfShowTrips=${encodeURIComponent(JSON.stringify(dataOfShowTrips))}&InforCusto=${encodeURIComponent(JSON.stringify(InforCusto))}`;
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
    // console.log("Nhận bookingId:", bookingId);

    // Kiểm tra tính hợp lệ của bookingId
    if (!bookingId || typeof bookingId !== 'string') {
      // console.log("Booking ID không hợp lệ.");
      return res.status(400).json({ message: 'Booking ID không hợp lệ.' });
    }

    // Tìm booking trong cơ sở dữ liệu
    const booking = await Booking.findById(bookingId);
    // console.log("Tìm thấy booking:", booking);

    if (!booking) {
      console.log(`Không tìm thấy booking với ID: ${bookingId}`);
      return res.status(404).json({ message: 'Không tìm thấy booking.' });
    }

    const { tripId, seatId, departureDate } = booking;
    // console.log("Chi tiết booking:", { tripId, seatId, departureDate });

    // Cập nhật trạng thái thanh toán của booking
    booking.paymentStatus = 'Đã thanh toán';
    await booking.save();
    console.log(`Cập nhật trạng thái thanh toán thành 'Đã thanh toán' cho bookingId: ${bookingId}`);

    // Tìm chuyến đi liên quan đến booking
    const trip = await Trips.findById(tripId);
    // console.log("Tìm thấy chuyến đi:", trip);

    if (!trip) {
      console.log(`Không tìm thấy chuyến đi với ID: ${tripId}`);
      return res.status(404).json({ message: 'Không tìm thấy chuyến đi.' });
    }

    const formattedDate = departureDate.replace("Th ", "").trim();
    const parts2 = formattedDate.split(", ");
    const dayMonthYear2 = parts2[1];
    const formattedTime = moment(dayMonthYear2, "D/MM/YYYY").tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    // console.log("formattedTime",formattedTime);
    const formattedBookingDate = moment.tz(formattedTime, 'Asia/Ho_Chi_Minh').startOf('day');
    // Tìm ngày chuyến đi trong chuyến đi
    console.log("formattedBookingDate",formattedBookingDate);
    const tripDate = trip.tripDates.find((td) =>
      moment(td.date).tz('Asia/Ho_Chi_Minh').isSame(moment(formattedBookingDate), 'day')
    );
    // console.log("Tìm thấy tripDate:", tripDate);

    if (!tripDate) {
      console.log(`Không tìm thấy ngày chuyến đi cho bookingDate: ${formattedBookingDate}`);
      return res.status(404).json({ message: 'Ngày chuyến đi không hợp lệ.' });
    }

    // Cập nhật trạng thái của ghế đã thanh toán
    tripDate.bookedSeats.booked = tripDate.bookedSeats.booked.map((seat) => {
      if (seatId.includes(seat.seatId)) {
        seat.status = 'Đã thanh toán';
        console.log(`Ghế ${seat.seatId} đã được cập nhật trạng thái thành 'Đã thanh toán'`);
      }
      return seat;
    });

    // Lọc các ghế đã thanh toán
    const paidSeats = tripDate.bookedSeats.booked.filter(
      (seat) => seat.status === 'Đã thanh toán'
    );
    // console.log("Danh sách ghế đã thanh toán:", paidSeats);

    // Tính tổng số ghế đã đặt
    const newSeatsBooked = paidSeats.length;
    console.log("Tổng số ghế đã đặt:", newSeatsBooked);

    // Tính toán doanh thu từ vé
    const ticketPrice = trip.totalFareAndPrice || 0;
    console.log("Giá vé:", ticketPrice);

    // Cập nhật số vé đã bán và doanh thu
    tripDate.sales.totalTicketsSold = newSeatsBooked;
    tripDate.sales.totalRevenue = tripDate.sales.totalTicketsSold * ticketPrice;
    console.log("Cập nhật tổng số vé bán và doanh thu cho tripDate:", tripDate.sales);

    // Lưu lại thông tin chuyến đi
    await trip.save();
    console.log("Chuyến đi đã được lưu thành công với thông tin doanh thu mới.");

    // Trả về thông báo thành công
    res.json({ status: 'success', message: 'Thanh toán thành công.' });
  } catch (error) {
    console.error('Lỗi khi xử lý thanh toán:', error);
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


module.exports = { processPayment, PaymetCancel, PaymetSuccess, getOrderfromPayOS,  };