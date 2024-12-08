function fetchWeatherData() {
    const apiKey = 'd7905f576564b0ef7d15a098fcfbf7ff';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                throw new Error(data.message || 'Error fetching current weather data');
            }
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch hourly forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== '200') {
                throw new Error(data.message || 'Error fetching forecast data');
            }
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}


function updateWeatherInfo(data) {
    const tempDiv = document.getElementById('temp-div');
    const weatherDetails = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherDetails.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDiv.innerHTML = '';

    const city = data.name;
    const tempCelsius = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
    const weatherDescription = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const tempHTML = `
        <p>${tempCelsius}°C</p>
    `;

    const weatherHTML = `
        <p>${city}</p>
        <p>${weatherDescription}</p>
    `;

    tempDiv.innerHTML = tempHTML;
    weatherDetails.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = weatherDescription;

    revealWeatherIcon();
}

function updateHourlyForecast(forecastData) {
    const forecastDiv = document.getElementById('hourly-forecast');
    if (!forecastData || forecastData.length === 0) {
        forecastDiv.innerHTML = '<p>No hourly forecast available.</p>';
        return;
    }

    const upcomingHours = forecastData.slice(0, 8); // Get data for the next 24 hours (3-hour intervals)

    upcomingHours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to Date object
        const hour = dateTime.getHours();
        const tempCelsius = Math.round(item.main.temp - 273.15); // Convert from Kelvin to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const forecastHTML = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Weather Icon for Hour">
                <span>${tempCelsius}°C</span>
            </div>
        `;

        forecastDiv.innerHTML += forecastHTML;
    });
}

function revealWeatherIcon() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Display the icon once it is set
}
