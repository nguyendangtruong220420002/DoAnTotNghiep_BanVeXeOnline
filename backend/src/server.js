const app = require('./app');
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

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