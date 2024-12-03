// Load biến môi trường từ file .env
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const indexRoutes = require('../src/routes/index');


// Middleware
app.use(cors());
// Increase payload limit
app.use(express.json({ limit: '10mb' })); // Allows up to 10MB JSON payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Sử dụng các routes
app.use('/api', indexRoutes);

module.exports = app;