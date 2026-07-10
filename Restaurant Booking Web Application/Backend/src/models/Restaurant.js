const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisines: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  tablesAvailable: { type: Number, default: 0 },
  image: { type: String },
  description: { type: String },
  latitude: { type: Number, default: 19.0760 },
  longitude: { type: Number, default: 72.8777 }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
