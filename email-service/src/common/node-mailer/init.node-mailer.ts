import { APP_PASSWORD, MAIL_SENDER } from '../constant/app.constant';

const nodemailer = require('nodemailer');

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: MAIL_SENDER,
    pass: APP_PASSWORD, //khong phai pass chinh mail
  },
});
export default transporter;
