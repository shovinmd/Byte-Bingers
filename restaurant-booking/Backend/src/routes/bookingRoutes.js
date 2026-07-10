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
      guests,
      email
    });
    await booking.save();

    // Send email confirmation if email is provided
    if (email) {
      const ticketCode = `CONCIERGE-${booking._id.toString().substring(0,6).toUpperCase()}`;
      const qrData = `Ticket ID: ${ticketCode}\nGuest Email: ${email}\nRestaurant: ${restaurantName || "Premium Dining Destination"}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

      const htmlContent = `
        <div style="background-color: #0d0d0d; color: #ffffff; font-family: 'Inter', 'Helvetica', Arial, sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">Byte-Bingers</h1>
            <p style="color: #a3a3a3; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Premium Dining Concierge</p>
          </div>
          
          <div style="border-top: 1px solid #1f2937; border-bottom: 1px solid #1f2937; padding: 25px 0; margin-bottom: 30px;">
            <p style="font-size: 16px; margin: 0 0 20px 0; color: #e5e5e5; line-height: 1.6;">Your reservation has been successfully confirmed. Below are your luxury seating details:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px; width: 140px;">Establishment:</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${restaurantName || "Premium Dining Destination"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px;">Date:</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px;">Arrival Time:</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px;">Diners Count:</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${guests} Guests</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 14px; color: #a3a3a3; margin-bottom: 15px;">Please present this QR code to the host upon arrival:</p>
            <div style="background-color: #ffffff; padding: 15px; display: inline-block; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
              <img src="${qrUrl}" alt="Reservation QR Code" style="display: block; width: 150px; height: 150px;" />
            </div>
            <p style="color: #f59e0b; font-size: 14px; font-weight: 600; margin-top: 15px; letter-spacing: 1px;">TICKET ID: ${ticketCode}</p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #737373; border-top: 1px solid #1f2937; padding-top: 20px;">
            <p style="margin: 0 0 5px 0;">This is a no-reply automated message from Byte-Bingers.</p>
            <p style="margin: 0;">&copy; 2026 Byte-Bingers. All rights reserved.</p>
          </div>
        </div>
      `;

      // Send to both user and admin
      const recipients = [email.trim(), "shovinmicheldavid1285@gmail.com"];

      const mailOptions = {
        from: `"No Reply - Byte-Bingers" <shovinmicheldavid1285@gmail.com>`,
        to: recipients,
        subject: `Reservation Confirmed - ${restaurantName || "Premium Seating"}`,
        text: `Your premium reservation for ${guests} guests has been confirmed at ${restaurantName || "our dining room"} on ${date} at ${time}. Ticket ID: ${ticketCode}`,
        html: htmlContent
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

// Get all bookings (Admin only)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Get All Bookings Error:", err);
    res.status(500).json({ error: "Server Error fetching all bookings" });
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
