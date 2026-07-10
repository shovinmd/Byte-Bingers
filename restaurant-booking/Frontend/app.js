const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors'); // CORS middleware
// No need for body-parser in newer versions of Express
// const bodyParser = require('body-parser'); 

// Create an Express app
const app = express();

// Enable CORS for all routes
app.use(cors()); 

// Built-in middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (make sure you set your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/tableBooking', { useNewUrlParser: true, useUnifiedTopology: true });

// Booking schema for MongoDB
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  time: String,
  guests: Number
});

const Booking = mongoose.model('Booking', bookingSchema);

// POST route for booking
app.post('/api/book', (req, res) => {
  const { name, email, date, time, guests } = req.body;

  if (!name || !email || !date || !time || !guests) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newBooking = new Booking({ name, email, date, time, guests });

  newBooking.save()
    .then(() => {
      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shovinmicheldavid1285@gmail.com', // Your email address
    pass: 'gzab novj wbyk vmyd'
        }
      });

      const mailOptions = {
        from: 'shovinmicheldavid1285@gmail.com',
        to: email,
        subject: 'Booking Confirmation',
        text: `Hello ${name},\n\nYour booking has been confirmed!\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\n\nThank you for booking with us!`
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).json({ message: 'Error sending email' });
        }
        res.status(200).json({ message: 'Booking successful and email sent!' });
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error saving booking to the database' });
    });
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
