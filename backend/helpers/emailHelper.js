const nodemailer = require("nodemailer");

const userGmail = "up.byte1@gmail.com";
const passAppGmail = "mmdh lvtj icmo epii";

const emailHelper = async (name, to, subject, phone, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userGmail,
      pass: passAppGmail,
    },
  });

  let mailOptions = {
    from: name,
    to: "up.byte1@gmail.com",
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
