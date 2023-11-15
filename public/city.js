// import 'dotenv/config';

const apiKey = "40f6beb9a3d9d3d1d6801a4a00e1ea86"

function updateTime(){
    let currentTime = document.querySelector('.time-container').firstElementChild
    const date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    currentTime.textContent = (hours + ':' + minutes + ' ' + ampm);
    setTimeout(updateTime, 1000);
}


// async function searchCity(e) {
//     e.preventDefault()
//     try {
//         const inputCity = document.getElementById('input-cityName');
//         const cityValue = inputCity.value;
//         inputCity.value = ''
//
//         const response = await fetch(`/search?city=${cityValue}`)
//
//
//         // api call
//         // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityNameValue}&appid=${apiKey}`);
//         // const data = await response.json();
//         //
//         // // clear text box?
//         // const {name, main, weather} = data;
//         // const fahrenheitTemp = (main.temp - 273.15) * 9/5 + 32
//         // alert(`${Math.trunc(fahrenheitTemp)} F`)
//     }
//     catch (error) {
//         console.log(error);
//     }
// }

function searchCity (cityName) {
    fetch(`/search?city=${encodeURIComponent(cityName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Response was not okay')
            }
            return response.json();
        })
        .then(data => {
            const inputCity = document.getElementById('input-cityName');
            const cityValue = inputCity.value;
            inputCity.value = ''
            // console.log(data)
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
        .catch(error => {
            console.log('There was an error with your request')
            console.log(error)
    })
}


document.addEventListener('DOMContentLoaded', (e) => {
    // const cityForm = document.getElementById('ctyNameSearch');
    // cityForm.addEventListener('submit', searchCity);
    updateTime()
})

// document.getElementById('ctyNameSearch').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const cityName = document.getElementById('input-cityName').value;
//     searchCity(cityName);
// });
