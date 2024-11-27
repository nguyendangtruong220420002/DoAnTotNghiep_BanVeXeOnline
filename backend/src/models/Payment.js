const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Tien mat', 'Chuyen khoan' , 'Quet ma Qr'],
    required: true 
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },
  amountPaid: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Thành công', 'Thất bại', 'Đang chờ','Đang xử lý'], 
    default: 'Đang chờ' 
  },
  paymentTransactionId: { 
    type: String, 
    required: true 
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;