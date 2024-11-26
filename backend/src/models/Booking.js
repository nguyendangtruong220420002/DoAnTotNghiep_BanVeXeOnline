const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip', 
    required: true 
  }, 
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  seatId: { 
    type: String, 
    required: true 
  }, 
  bookingDate: { 
    type: Date, 
    default: Date.now 
  },
  selectedDepartureName:{ 
    type: String, 
    required: true 
  }, 
  selectedDestinationName:{ 
    type: String, 
    required: true 
  }, 
  Timehouse:{ 
    type: String, 
    required: true 
  }, 
 departureDate:{ 
    type: String, 
    required: true 
  }, 
  totalFare: { 
    type: Number, 
    required: true 
  }, 
  paymentStatus: { 
    type: String, 
    enum: ['Đang chờ thanh toán', 'Đã thanh toán', 'Thanh toán không thành công', 'Đã Hủy'], 
    default: 'Đang chờ thanh toán' 
  },
  passengerInfo: {
    fullName: { 
      type: String, 
      required: true 
    }, 
    phoneNumber: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String 
    } 
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
