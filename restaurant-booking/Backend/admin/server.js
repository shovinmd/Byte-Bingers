const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
const PORT = 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/Restaurants', restaurantRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
