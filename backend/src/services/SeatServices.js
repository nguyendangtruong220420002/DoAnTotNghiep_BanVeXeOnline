const Trips = require('../../src/models/Trips');
const moment = require('moment-timezone');

class SeatServices {
    async getBookingSeat(body) {
        try {
            const params = body;
            console.log("tripId", params.tripId);

            const trip = await Trips.findById(params.tripId);
            if (!trip) {
                return {
                    success: false,
                    message: "Chuyến đi không tồn tại",
                    data: null
                };
            }

            const formattedBookingDate = moment.tz(params.bookingDate, 'Asia/Ho_Chi_Minh').startOf('day');
            if (!formattedBookingDate.isValid()) {
                return {
                    success: false,
                    message: "Ngày đặt vé không hợp lệ",
                    data: null
                };
            }

            const tripDate = trip.tripDates.find((td) =>
                moment(td.date).tz('Asia/Ho_Chi_Minh').isSame(formattedBookingDate, 'day')
            );

            if (!tripDate) {
                return {
                    success: false,
                    message: "Ngày này không có sẵn cho chuyến xe",
                    data: null
                };
            }

            const bookedSeats = tripDate.bookedSeats ? tripDate.bookedSeats.booked : [];
            return {
                success: true,
                message: "Danh sách ghế đã đặt",
                data: {
                    bookedSeats: bookedSeats.map(seat => ({
                        seatId: seat.seatId,
                        userId: seat.userId,
                        bookingDate: seat.bookingDate,
                        status: seat.status, // Include seat status
                    })),
                    tripId: trip._id
                }
            };

        } catch (error) {
            console.error("Error fetching booked seats:", error);
            return {
                success: false,
                message: "Không thể lấy danh sách ghế đã đặt. Vui lòng thử lại sau.",
                data: null
            };
        }
    }
    async bookSeats(body) {
        const params = body;
        const tripId = params.tripId
        const bookingDate = params.bookingDate
        const seats = params.seats
        const userId = params.userId;

        try {
            if (!userId) {
                return {
                    success: false,
                    statusCode: 401,
                    message: "Bạn cần đăng nhập để đặt vé. Vui lòng đăng nhập lại !!!"
                };
            }

            if (!Array.isArray(seats) || seats.length === 0) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Dữ liệu ghế không hợp lệ. Vui lòng chọn lại ghế."
                };
            }

            const formattedBookingDate = moment.tz(bookingDate, 'Asia/Ho_Chi_Minh').startOf('day');
            if (!formattedBookingDate.isValid()) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Ngày đặt vé không hợp lệ"
                };
            }

            const trip = await Trips.findById(tripId);
            if (!trip) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "Chuyến đi không tồn tại"
                };
            }

            const tripDate = trip.tripDates.find((td) =>
                moment(td.date).tz('Asia/Ho_Chi_Minh').isSame(formattedBookingDate, "day")
            );

            if (!tripDate) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "Ngày này không có sẵn cho chuyến xe"
                };
            }

            if (!tripDate.bookedSeats) {
                tripDate.bookedSeats = { booked: [] };
            }

            const bookedSeatIds = new Set(tripDate.bookedSeats.booked.map((seat) => seat.seatId));
            const conflictingSeats = seats.filter((seat) => bookedSeatIds.has(seat));

            if (conflictingSeats.length > 0) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Chỗ đã được đặt trước !!! Vui lòng chọn chỗ khác",
                    data: { conflictingSeats }
                };
            }

            seats.forEach((seat) => {
                tripDate.bookedSeats.booked.push({
                    seatId: seat,
                    userId: userId,
                    bookingDate: new Date(),
                    status: 'Đã đặt'
                });
            });

            const newSeatsBooked = seats.length;
            const ticketPrice = trip.totalFareAndPrice || 0;
            tripDate.sales.totalTicketsSold += newSeatsBooked;
            tripDate.sales.totalRevenue = tripDate.sales.totalTicketsSold * ticketPrice;

            await trip.save();

            io?.emit('seatsUpdated', {
                tripId,
                bookingDate: formattedBookingDate.format('YYYY-MM-DD'),
                seatsBooked: seats
            });

            return {
                success: true,
                statusCode: 200,
                message: "Đặt ghế thành công!",
                data: { bookedSeats: tripDate.bookedSeats }
            };
        } catch (error) {
            console.error("Error booking seats:", error);
            return {
                success: false,
                statusCode: 500,
                message: "Không thể đặt ghế. Vui lòng thử lại sau."
            };
        }
    }
}

module.exports = new SeatServices();
