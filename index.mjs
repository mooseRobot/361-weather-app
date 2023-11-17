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

function kelvinToCelsius(kelvin) {
    return Math.trunc((kelvin - 273) * 9/5 + 32);
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
}

function createWeatherCard(record, cityName) {
    const date = formatDate(record.dt);
    const description = record.weather[0].description;
    const highTemp = kelvinToCelsius(record.main.temp_max) + '°';
    const lowTemp = kelvinToCelsius(record.main.temp_min) + '°';
    const iconCode = record.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`

    return `
        <div class="weather-card-container">
            <div class="date">${date}</div>
            <div class="weather-card">
                <div class="weather-header">
                    <div class="weather-glace">
                        <img src="${iconUrl}" class="weather-icon margin-10" alt="${cityName} weather" width="40"/>
                        <div class="description margin-10">${description}</div>
                    </div>
                    <div class="temperatures">
                        <div class="high margin-top-bottom-10">High: ${highTemp}</div>
                        <div class="low margin-top-bottom-10">Low: ${lowTemp}</div>
                    </div>
                </div>
                <div class="precipitation">Precipitation: 45%</div> <!-- Adjust if you have precipitation data -->
            </div>
        </div>`;
}

function createMainWeatherCard(record, cityName) {
    const date = formatDate(record.dt);
    const description = record.weather[0].description;
    const highTemp = kelvinToCelsius(record.main.temp_max).toFixed(1) + '°';
    const lowTemp = kelvinToCelsius(record.main.temp_min).toFixed(1) + '°';


    return `
        <div class="weather-card-container">
        <div class="date">${date}</div>
        <div class="weather-card weather-main">
            <div class="weather-header-main flex">
                <div class="weather-icon">☁️</div>
                <div class="city-name h1-font-size">${cityName}</div>
                <div class="refresh">🔄</div>
            </div>
            <div class="sub-header-main flex">
                <div class="description">Cloudy</div>
                <div class="current-temperature h1-font-size">75°</div>
            </div>
            <div class="main-info-main flex">
                <div class="high margin-5">High: 89°</div>
                <div class="UV-index margin-5">UV Index: 8</div>
                <div class="low margin-5">Low: 70°</div>
                <div class="humidity margin-5">30%</div>
            </div>
            <div class="precipitation">Precipitation: 45%</div>
        </div>
    </div>
`
}


const htmlTop = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>SkyCheck</title>
        <script src='city.js' defer></script>
        <link rel="stylesheet" href="results.css">
    </head>
    <body>
    <div class="time-container">
        <p id="current-time-post">00:00</p>
        <div class="search-bar">
            <form id="ctyNameSearch" action="/search" method="GET">
                <input type="search" id="input-cityName" name="city" placeholder="Enter a city name" required>
                <input type="submit" id="submit-button" value="Submit">
            </form>
        </div>
    </div>
    <div class="weather-container">
`

const htmlBottom = `
    </div>
`

app.get("/search", async (req, res) => {
    const cityName = req.query.city;
    let currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    let historicalEnd = Math.floor(Date.now() / 1000) - 86400;
    let historicalStart = historicalEnd - (86400 * 2);
    let historicalWeather = `https://history.openweathermap.org/data/2.5/history/city?q=${cityName}&type=hour&start=${historicalStart}&end=${historicalEnd}&appid=${apiKey}`

    try {
        let currentWeatherResponse = await fetch(currentWeather);
        let historicalResponse = await fetch(historicalWeather);

        let data = await currentWeatherResponse.json();

        let historicalData = await historicalResponse.json();
        let middle = Math.floor(historicalData.list.length / 2);
        let firstRecord = historicalData.list[0];
        let midRecord = historicalData.list[middle];
        let lastRecord = historicalData.list[historicalData.list.length-1];

        const firstCardHtml = createWeatherCard(firstRecord, cityName);
        const midCardHtml = createWeatherCard(midRecord, cityName);
        const lastCardHtml = createWeatherCard(lastRecord, cityName);

        // Redirect to the /results route with the weather data
        // res.json(data); // Send JSON response
        res.send(`${htmlTop}
        ${firstCardHtml}
        ${midCardHtml}
        ${lastCardHtml}
        ${htmlBottom}
`)
    } catch (error) {
        // Handle errors
        res.status(500).send('Error fetching weather data');
    }
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});