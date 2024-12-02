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
  userId: {   // của nhà xe
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
 

  tripType: { type: String, enum: ['Cố định', 'Không cố định'], required: true },

  tripDates: [
    {
      date: { type: Date, required: true }, // Ngày của chuyến đi
      sales: {
        totalTicketsSold: { type: Number, required: true, default: 0 },
        totalRevenue: { type: Number, required: true, default: 0 }
      },
      bookedSeats: 
        {
          booked: [
            {
              seatId: { type:String, required: true },
              userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                // required: true, 
              },bookingDate: { type: Date, default: Date.now },
              status: { 
                type: String, 
                enum: ['Đã đặt', 'Đã thanh toán','Đã đặt trước','Đã Hủy'], 
                default: 'Đã đặt' 
              },
              note: { type: String, required: false }
            }
          ]
        }  
    }
  ],
  schedule: [{  
    name: { type: String, default: null}, 
    address: { type: String, default: null  },
    time: { type: String, default: null },
  }],
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;