require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.WEATHERAPI_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// Serve static UI
app.use(express.static(path.join(__dirname, 'public')));

// Simple health route
app.get('/ping', (req, res) => res.json({ok: true}));

// Weather endpoint: GET /weather?city=CityName
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({error: 'Missing city parameter'});
    if (!API_KEY) return res.status(500).json({error: 'Server missing WEATHERAPI_KEY env var'});

    try {
        const response = await axios.get(BASE_URL, {
            params: { q: city, key: API_KEY, aqi: 'no' }
        });
        res.json(response.data);
    } catch (err) {
        const message = err.response?.data?.error?.message || err.message;
        res.status(502).json({ error: message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});