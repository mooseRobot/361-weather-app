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

function formatMainDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // Extract the day for the ordinal suffix
    const day = date.getDate();
    const ordinalSuffix = getOrdinalSuffix(day);

    return `${date.toLocaleDateString('en-US', { month: 'long' })} ${day}${ordinalSuffix}, ${date.getFullYear()}`;
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}


function createWeatherCard(record, cityName) {
    const date = formatMainDate(record.weatherDate);
    const description = record.description;
    const highTemp = Math.trunc(record.temperature_max) + '°';
    const lowTemp = Math.trunc(record.temperature_min) + '°';
    const iconUrl = record.icon_url;
    const humidity = record.humidity + '%'; // Adjusted to use humidity from the data

    return `
        <div class="weather-card-container">
            <div class="date">${date}</div>
            <div class="weather-card">
                <div class="weather-header">
                    <div class="weather-glace">
                        <img src="${iconUrl}" class="weather-icon margin-10" alt="${cityName} weather" width="40"/>
                        <div class="description margin-5 width-85px">${description}</div>
                    </div>
                    <div class="temperatures">
                        <div class="high margin-top-bottom-10">High: ${highTemp}</div>
                        <div class="low margin-top-bottom-10">Low: ${lowTemp}</div>
                    </div>
                </div>
                <div class="precipitation">Humidity: ${humidity}</div>
            </div>
        </div>`;
}

function createMainWeatherCard(record, cityName) {
    const currentWeather = record.current_weather;
    const date = formatMainDate(new Date(currentWeather.currentDate));
    const description = currentWeather.weather_description;
    const highTemp = currentWeather.temperature_max.toFixed() + '°';
    const lowTemp = currentWeather.temperature_min.toFixed() + '°';
    const currentTemperature = currentWeather.current_temperature.toFixed() + '°';
    const humidity = currentWeather.humidity + '%';
    const cloudiness = currentWeather.cloudiness + '%';
    const feelsLike = currentWeather.feels_like.toFixed() + '°';
    const weatherIconUrl = currentWeather.weather_icon_url;

    return `
        <div class="weather-card-container">
            <div class="date">${date}</div>
            <div class="weather-card weather-main">
                <div class="weather-header-main flex">
                    <div class="weather-icon"><img src="${weatherIconUrl}" alt="Weather Icon"></div>
                    <div class="city-name h1-font-size">${cityName}</div>
                    <div id="refresh">🔄</div>
                </div>
                <div class="sub-header-main flex">
                    <div class="description">${description}</div>
                    <div class="current-temperature h1-font-size">${currentTemperature}</div>
                </div>
                <div class="main-info-main flex">
                    <div class="high margin-5">High: ${highTemp}</div>
                    <div class="UV-index margin-5">Cloudiness: ${cloudiness}</div>
                    <div class="low margin-5">Low: ${lowTemp}</div>
                    <div class="humidity margin-5">Humidity: ${humidity}</div>
                </div>
                <div class="precipitation">Feels Like: ${feelsLike}</div>
            </div>
        </div>
    `;
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

    let weatherResponse = await fetch(`http://127.0.0.1:5000/?cityname=${cityName}`)

    try {

        //
        let weatherData = await weatherResponse.json()
        const previousWeatherHtml = createWeatherCard(weatherData[0]["previous_weather_2_day"], cityName);
        const dayBeforeWeatherHtml = createWeatherCard(weatherData[1]["previous_weather_1_day"], cityName);
        const mainCardHtml = createMainWeatherCard(weatherData[2], cityName);
        const dayAfterWeatherHtml = createWeatherCard(weatherData[3]["future_weather"], cityName);
        const twoDaysAfterWeatherHtml = createWeatherCard(weatherData[4]["future_weather_next"], cityName);

        // Redirect to the /results route with the weather data
        // res.json(data); // Send JSON response
        res.send(`${htmlTop}
        ${previousWeatherHtml}
        ${dayBeforeWeatherHtml}
        ${mainCardHtml}
        ${dayAfterWeatherHtml}
        ${twoDaysAfterWeatherHtml}
        ${htmlBottom}
`)
    } catch (error) {
        // Handle errors
        res.status(500).send('Error fetching weather data');
        console.log(error)
    }
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});