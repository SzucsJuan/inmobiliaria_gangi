const nodemailer = require("nodemailer");

const userGmail = process.env.EMAIL_USER;
const passAppGmail = process.env.EMAIL_PASS;

const emailHelper = async (name, to, phone, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userGmail,
      pass: passAppGmail,
    },
  });

  let mailOptions = {
    from: userGmail,
    to: userGmail,
    replyTo: to,
    subject: subject,
    text: `Nombre: ${name}\nCorreo: ${to}\nTeléfono: ${phone}\n\nMensaje:\n${text}`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = emailHelper;
