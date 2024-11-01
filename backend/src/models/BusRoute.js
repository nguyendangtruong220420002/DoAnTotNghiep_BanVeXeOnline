const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
    routeName: { type: String, required: true },
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    stops: { type: String },
    distance: { type: Number, required: true },
    totalFare: { type: Number, required: true },
    userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

const BusRoute = mongoose.model('BusRoute', busRouteSchema);

module.exports = BusRoute;