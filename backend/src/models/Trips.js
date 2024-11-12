const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  TripsName: { 
    type: String, 
    required: true 
  },
  routeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BusRoute', 
    required: true 
  },
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  departureTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  totalFareAndPrice: { 
    type: Number,  
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Đang hoạt động', 'Hủy','Hoạt động thành công'], 
    default: 'Đang hoạt động' 
  },
  bookedSeats: { 
    type: [Number],  // Mảng chứa số ghế đã đặt
    default: [] 
  },
  tripType: { type: String, enum: ['Cố định', 'Không cố định'], required: true },
  tripDates: [{ 
    date: { type: Date, required: true },
    sales: { 
      totalTicketsSold: { type: Number, required: true, default: 0 },
      totalRevenue: { type: Number, required: true, default: 0 }
    }
  }], 
  schedule: [{  
    name: { type: String, default: null}, 
    address: { type: String, default: null  },
    time: { type: String, default: null },
  }],
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;