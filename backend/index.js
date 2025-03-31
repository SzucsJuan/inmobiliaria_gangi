const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const emailRoutes = require("./routes/emailRoutes");

dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY;

// console.log(`The API key is: ${API_KEY}`);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/props', async (req, res) => {
  const apiKey = process.env.API_KEY;
  const url = `https://api.argencasas.com/props?api_key=${apiKey}`;

  try {
    const fetch = (await import('node-fetch')).default; 
    const response = await fetch(url);
    const data = await response.json();
    console.log('Propiedades obtenidas:', data);
    res.json(data);
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).send('Error al obtener datos');
  }
});


app.get("/api/data", (req, res) => {
  res.json({ message: "API ready" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api", emailRoutes);
