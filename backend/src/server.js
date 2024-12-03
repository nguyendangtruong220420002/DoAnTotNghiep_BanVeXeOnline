const app = require('./app');
const mongoose = require('mongoose');
const setupSocket = require('./config/setupSocket');

const express = require('express');

const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

setupSocket()

const path = require('path');
const distPath = path.resolve(__dirname, '../dist');

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connect MongoDB success!');

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connect MongoDB:', err);
    process.exit(1);
  });

//backend deploy