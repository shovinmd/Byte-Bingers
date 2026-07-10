const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  restaurantName: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  email: { type: String },
  status: { type: String, default: "Confirmed" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
