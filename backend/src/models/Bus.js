const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName: { 
    type: String, 
    required: true 
  },
  busType: { 
    type: String, 
    required: true,
    enum: [
      "Ghế(16G)", 
      "Ghế(24G)", 
      "Ghế(30G)", 
      "Giường nằm cao cấp(40G)", 
      "Khách sạc đi động(34G)", 
      "Limousine(20G)", 
      "Giường đôi (16G)"
    ] 
  },
  cartSeat:{
    type: Number, 
    required: true, 
   
  },
  licensePlate: { 
    type: String, 
    required: true, 
    unique: true,
  },
  img: { 
    type: String, 
    default: null 
  },
  Price: {
    type: Number,
    required: true,

  },
  status: { 
    type: String, 
    enum: ['Đang phục vụ', 'Chờ'],
    default: 'Chờ'
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;