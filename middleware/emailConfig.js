const nodemailer = require("nodemailer");

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "sindhuku3@gmail.com",
    pass: "hkpw lepi rmnq vymu", // Note: Use App Password instead of your Gmail password
  },
});

module.exports={transporter} ;