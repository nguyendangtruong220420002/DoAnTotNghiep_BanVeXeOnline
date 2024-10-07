const express = require('express');
const cors = require('cors');
const app = express();
const indexRoutes = require('../src/routes/index');
// Load biến môi trường từ file .env
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Sử dụng các routes
app.use('/api', indexRoutes);

module.exports = app;