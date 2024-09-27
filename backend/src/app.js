const express = require('express');
const cors = require('cors');
const app = express();

// Load biến môi trường từ file .env
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/index'));

module.exports = app;