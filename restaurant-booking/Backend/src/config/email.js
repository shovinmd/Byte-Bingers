const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "shovinmicheldavid1285@gmail.com",
    pass: process.env.EMAIL_PASS || "mair uslt ccoh uttv"
  },
});

module.exports = transporter;
