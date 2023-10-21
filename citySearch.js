let cityForm = document.getElementById('ctyNameSearch');

const apiKey = '40f6beb9a3d9d3d1d6801a4a00e1ea86'

cityForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let inputCityName = document.getElementById('input-cityName');
    let cityNameValue = inputCityName.value;


    // Set up AJAX request
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameValue}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const {name, main, weather} = data;
            // Convert kelvin to fahrenheit
            const fahrenheitTemp = (main.temp - 273.15) * 9/5 + 32

            const container = document.getElementById('information-container')
            const cityWeatherContent = document.createElement('div');
            cityWeatherContent.textContent = `${name}: ${Math.trunc(fahrenheitTemp)} F`;

            container.appendChild(cityWeatherContent);

            // Get icon
            const icon = document.createElement('img')

            const iconCode = weather[0].icon;
            icon.src = `http://openweathermap.org/img/w/${iconCode}.png`
            container.appendChild(icon)
        })
        .catch(() => alert('error'))


})