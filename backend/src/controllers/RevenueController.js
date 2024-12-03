const Booking = require("../models/Booking");
const Trip = require("../models/Trips");

const getRevenueByBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm các trip theo userId
        const trips = await Trip.find({ userId: id });
        const tripIds = trips.map(trip => trip._id); // Lấy _id của các trip

        // Tìm các booking liên quan đến các trip với paymentStatus = 'Đã thanh toán'
        const bookings = await Booking.find({
            tripId: { $in: tripIds },
            paymentStatus: 'Đã thanh toán'
        });

        console.log('Bookings:', bookings);

        res.status(200).json({ trips, bookings });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }

}

const getRevenueByAdmin = async (req, res) => {
    try {
        // Step 1: Find bookings with paymentStatus 'Đã thanh toán'
        const bookings = await Booking.find({
            paymentStatus: 'Đã thanh toán'
        });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found with payment status "Đã thanh toán"' });
        }

        // Step 2: Get all trips with userIds matching the tripIds from bookings
        const tripIds = bookings.map(booking => booking.tripId);
        const trips = await Trip.find({
            '_id': { $in: tripIds }
        }).select('userId');

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found for the given bookings' });
        }

        res.status(200).json({ trips: trips, bookings: bookings });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}



module.exports = { getRevenueByBooking, getRevenueByAdmin }