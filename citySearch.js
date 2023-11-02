import 'dotenv/config';

let cityForm = document.getElementById('ctyNameSearch');

const apiKey = process.env.APIKEY

cityForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let inputCityName = document.getElementById('input-cityName');
    let cityNameValue = inputCityName.value;


    // Set up AJAX request
    let currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameValue}&appid=${apiKey}`;

    Promise.all([
        fetch(currentWeather).then(response => response.json()),
        fetch(currentWeather).then(response => response.json())
    ]).then(data => {
        console.log(data)  // Returns an array of data objects.
    })



    // fetch(url)
    //     .then(response => response.json())
    //     .then(data => {
    //         const {name, main, weather} = data;
    //         // Convert kelvin to fahrenheit
    //         const fahrenheitTemp = (main.temp - 273.15) * 9/5 + 32
    //
    //         const container = document.getElementById('information-container')
    //         const cityWeatherContent = document.createElement('div');
    //         cityWeatherContent.textContent = `${name}: ${Math.trunc(fahrenheitTemp)} F`;
    //
    //         container.appendChild(cityWeatherContent);
    //
    //         // Get icon
    //         const icon = document.createElement('img')
    //
    //         const iconCode = weather[0].icon;
    //         icon.src = `http://openweathermap.org/img/w/${iconCode}.png`
    //         container.appendChild(icon)
    //     })
    //     .catch(() => alert('error'))


})

