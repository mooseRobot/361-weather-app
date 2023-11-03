import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';

const PORT = process.env.PORT;
const apiKey = process.env.APIKEY;
const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));


app.get("/search", async (req, res) => {
    const cityName = req.query.city;
    let currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    try {
        let response = await fetch(currentWeather);
        let data = await response.json();

        // Redirect to the /results route with the weather data
        res.json(data); // Send JSON response
    } catch (error) {
        // Handle errors
        res.status(500).send('Error fetching weather data');
    }
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});