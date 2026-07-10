const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed! Error details:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
