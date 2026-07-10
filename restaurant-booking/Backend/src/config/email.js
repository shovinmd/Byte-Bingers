const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shovinmicheldavid1285@gmail.com",
    pass: "mair uslt ccoh uttv"
  },
});

module.exports = transporter;
