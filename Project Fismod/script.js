const cityInput = document.querySelector(".city-Input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");

const API_KEY = "9938fd430f7fa27b55089388fb18aaf8" // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main card
        const windSpeed = weatherItem.wind.speed;
        let windCategory = "";

        if (windSpeed < 4) {
            windCategory = "Tidak Layak";
        } else if (windSpeed >= 4 && windSpeed < 12) {
            windCategory = "Layak";
        } else if (windSpeed > 12) {
            windCategory = "Ekstrim";
        } else {
            windCategory = "Sangat Layak";
        }

        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Suhu: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Kecepatan angin: ${weatherItem.wind.speed} m/s</h4>
                    <h4>Kelembaban: ${weatherItem.main.humidity}%</h4>
                    <h4>Kecocokan kondisi lingkungan untuk membangun PLTB: ${windCategory}<h4>
                </div>`;
    } 
}
    

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // Filter the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        })


        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });

    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user entered city name and remove extra spaces
    if(!cityName) return; // Return if cityName is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!");
    });
}

searchButton.addEventListener("click", getCityCoordinates);