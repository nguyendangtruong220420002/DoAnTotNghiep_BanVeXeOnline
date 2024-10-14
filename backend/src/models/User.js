const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['User', 'Business', 'Admin'],
    default: 'User'
  },
  address: { type: String, default: null },
  img: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;