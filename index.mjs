import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import asyncHandler from 'express-async-handler';
import { engine } from 'express-handlebars';

const PORT = process.env.PORT;
const apiKey = process.env.APIKEY;
const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './public');


let htmlTop = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Weather App</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='public/styles.css'>
</head>
`

let htmlBottom = `
    </main>
<footer>
<p>&copy; 2023</p>
</footer>
</body>
</html>
`


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

app.get("/", (req, res) => {
    res.send('public/skeleton')
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});