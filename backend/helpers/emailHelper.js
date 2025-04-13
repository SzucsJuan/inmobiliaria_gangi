const nodemailer = require("nodemailer");

const userGmail = "juliandgangi@gmail.com";
const passAppGmail = "halh aimt oayf xtfx"; 

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
    to: `${userGmail}`,
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
