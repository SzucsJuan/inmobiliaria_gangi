// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Configurar Nodemailer con SMTP
// const transporter = nodemailer.createTransport({
//   service: 'hotmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// app.post('/send-email', async (req, res) => {
//   const { name, email, phone, subject, message } = req.body;

//   const mailOptions = {
//     from: email,
//     to: process.env.EMAIL_USER,
//     subject: Nuevo mensaje de ${name} - ${subject},
//     text: `
//       Nombre: ${name}
//       Correo: ${email}
//       Teléfono: ${phone}
//       Asunto: ${subject}
//       Mensaje:
//       ${message}
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error al enviar el correo', error });
//   }
// });

// app.listen(PORT, () => {
//   console.log(Servidor corriendo en http://localhost:${PORT});
// });