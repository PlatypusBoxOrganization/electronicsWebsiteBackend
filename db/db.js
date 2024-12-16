const mongoose = require('mongoose');
require('dotenv').config();

const db = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined. Please check your .env file.');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('DB connected successfully');
  } catch (error) {
    console.error('Db connected error:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = {db};
