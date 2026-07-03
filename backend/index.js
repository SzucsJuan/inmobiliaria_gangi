const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const emailRoutes = require("./routes/emailRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes, intentá de nuevo más tarde." },
});

app.use("/api", apiLimiter);

app.get("/api/data", (req, res) => {
  res.json({ message: "API ready" });
});

const argencasasProxy = (endpoint) => async (req, res) => {
  const apiKey = process.env.API_KEY;
  const url = `https://api.argencasas.com/${endpoint}?api_key=${apiKey}`;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status}`);
      return res.status(response.status).send(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error al obtener ${endpoint}:`, error);
    res.status(500).send("Error al obtener datos");
  }
};

app.get("/api/props", argencasasProxy("props"));
app.get("/api/zones", argencasasProxy("zonas"));
app.get("/api/operations-status", argencasasProxy("operaciones"));
app.get("/api/types", argencasasProxy("tipos"));
app.get("/api/varios", argencasasProxy("varios"));

app.use("/api", emailRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});