const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY;

console.log(`The API key is: ${API_KEY}`);

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/data', (req, res) => {
    res.json({  message: 'API ready' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

