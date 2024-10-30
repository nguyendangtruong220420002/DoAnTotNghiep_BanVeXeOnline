const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName: { 
    type: String, 
    required: true 
  },
  busType: { 
    type: String, 
    required: true 
  },
  cartSeat:{
    type: Number, 
    required: true, 
   
  },
  licensePlate: { 
    type: String, 
    required: true, 
  
  },
  img: { 
    type: String, 
    default: null 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;