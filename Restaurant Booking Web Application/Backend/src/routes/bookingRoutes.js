const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const transporter = require("../config/email");

// Create a booking
router.post("/", async (req, res) => {
  try {
    const { userId, restaurantId, restaurantName, date, time, guests, email } = req.body;

    const booking = new Booking({
      userId,
      restaurantId,
      restaurantName: restaurantName || "Premium Dining Destination",
      date,
      time,
      guests
    });
    await booking.save();

    // Send email confirmation if email is provided
    if (email) {
      const mailOptions = {
        from: "shovinmicheldavid1285@gmail.com",
        to: email,
        subject: "Booking Confirmation - Byte-Bingers Concierge",
        text: `Your premium reservation for ${guests} guests has been confirmed at ${restaurantName || "our dining room"} on ${date} at ${time}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email sending error:", error);
          return res.status(201).json({ message: "Table booked successfully! (Confirmation email failed)", booking });
        }
        return res.status(201).json({ message: "Table booked successfully! Confirmation email sent.", booking });
      });
    } else {
      res.status(201).json({ message: "Table booked successfully!", booking });
    }
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Get bookings for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Get Bookings Error:", err);
    res.status(500).json({ error: "Server Error fetching bookings" });
  }
});

// Cancel a booking
router.delete("/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking cancelled successfully", booking: deletedBooking });
  } catch (err) {
    console.error("Cancel Booking Error:", err);
    res.status(500).json({ error: "Server Error cancelling booking" });
  }
});

module.exports = router;
