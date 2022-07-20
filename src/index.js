import "./cssReset.css";
import "./style.css";

function importAll(r) {
    let images = {};
    r.keys().map(item => { images[item.replace('./', '')] = r(item) });
    return images;
}

const images = importAll(require.context('./Assets', false, /\.png/));


const getWeather = async () => {
    const locationInput = document.querySelector("#search");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${locationInput.value}&appid=646b40771116a971c76a3a8a720592c6&units=metric`,
            { mode: "cors" }
        );
        const weatherData = await response.json();
        console.log(weatherData);
        console.log(weatherData.main.temp);

        const container = document.querySelector(".searchContainer");
        const tempDataContainer = document.querySelector(".tempDataContainer")
        if (!container.classList.contains("expand")){
            container.classList.toggle("expand");
            tempDataContainer.classList.toggle("expand")
        }
        
        const location = document.querySelector("#location")
        const countryCode = weatherData.sys.country
        location.textContent = `${weatherData.name}, ${countryCode}`
        const temperature = document.querySelector("#temperature");
        temperature.textContent = `Temp: ${weatherData.main.temp}℃`;
        const weatherCondition  = document.querySelector("#condition")
        weatherCondition.textContent = weatherData.weather[0].description
        const weatherElement = document.querySelector("#weatherIcon")
        const weatherIcon = weatherData.weather[0].icon
        if (weatherIcon == "04n" || weatherIcon == "04d"){
            weatherElement.src = images['04d.png']
        } else if (weatherIcon == "03d" || weatherIcon == "03n"){
            weatherElement.src = images['03d.png']
        } else if (weatherIcon == "09d" || weatherIcon == "09n"){
            weatherElement.src = images['09d.png']
        } else if (weatherIcon == "11d" || weatherIcon == "11n"){
            weatherElement.src = images['11d.png']
        } else if (weatherIcon == "13n" || weatherIcon == "13d"){
            weatherElement.src = images['13d.png']
        } else if(weatherIcon == "50n" || weatherIcon == "50d"){
            weatherElement.src = images['50d.png']
        } else {
            weatherElement.src = images[`${weatherIcon}.png`]
        } 
        const humidity = document.querySelector("#humidity");
        humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
        const maxMinTemp = document.querySelector("#maxMinTemp");
        maxMinTemp.textContent = `Min: ${weatherData.main.temp_min}℃, Max: ${weatherData.main.temp_max}℃ `;
        

        
        
    } catch (error) {
        //throw error
        console.log(error);
        if ((locationInput.value = "")) {
            locationInput.reportValidity();
        } else if (error instanceof TypeError) {
            locationInput.setCustomValidity("Invalid Location");
            locationInput.reportValidity();
        } else {
            throw error;
        }
    }
};

const locationInput = document.querySelector("#search");
const searchButton = document.querySelector("#searchButton");
searchButton.onclick = function () {
    getWeather();
};
locationInput.addEventListener("keydown", (e) => {
    if (e.keyCode == "13") {
        getWeather();
    }
});
