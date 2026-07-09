const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const userGmail = process.env.EMAIL_USER;
const passAppGmail = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userGmail,
    pass: passAppGmail,
  },
});

const mailOptions = {
  from: userGmail,
  to: userGmail,
  subject: "Test Email 222",
  text: "This is a test email from Node.js!",
};


transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  }
  console.log("Email sent: " + info.response);
});