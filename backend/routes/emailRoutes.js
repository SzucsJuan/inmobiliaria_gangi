const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const emailHelper = require("../helpers/emailHelper");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

const sendEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados mensajes enviados. Probá de nuevo más tarde." },
});

router.post("/send-email", sendEmailLimiter, async (req, res) => {
  const { name, to, subject, phone, text } = req.body;

  const fields = { name, to, subject, phone, text };
  const hasEmptyField = Object.values(fields).some(
    (value) => typeof value !== "string" || !value.trim()
  );

  if (hasEmptyField) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!EMAIL_REGEX.test(to.trim())) {
    return res.status(400).json({ error: "El correo ingresado no es válido" });
  }

  if ([name, subject, phone].some((value) => value.trim().length > MAX_SHORT_FIELD_LENGTH)) {
    return res.status(400).json({ error: "Uno de los campos excede la longitud permitida" });
  }

  if (text.trim().length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "El mensaje es demasiado largo" });
  }

  try {
    let info = await emailHelper(name, to, phone, subject, text);
    res.status(200).send(`Email sent: ${info.response}`);
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

module.exports = router;