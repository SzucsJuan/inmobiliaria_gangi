const express = require("express");
const router = express.Router();
const emailHelper = require("../helpers/emailHelper");

router.post("/send-email", async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { name, to, subject, phone, text } = req.body;

  if (!name || !to || !phone || !subject || !text) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    let info = await emailHelper(name, to, phone, subject, text);
    res.status(200).send(`Email sent: ${info.response}`);
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

module.exports = router;
