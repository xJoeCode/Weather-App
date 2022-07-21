import "./cssReset.css";
import "./style.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

function importAll(r) {
    let images = {};
    r.keys().map((item) => {
        images[item.replace("./", "")] = r(item);
    });
    return images;
}
const images = importAll(require.context("./Assets", false, /\.png/));

mapboxgl.accessToken = "pk.eyJ1IjoieGpvZWNvZGUiLCJhIjoiY2w1dXY5YTNpMDNtZzNpdDI5OG41dGdjaiJ9.Wjep6ktha7Glm7JsTBDwgg";

const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: "globe", // display the map as a 3D globe
});

map.on("style.load", () => {
    //map.setFog({}); // Set the default atmosphere style
});

map.on('load', () => {

    images.forEach(image => map.loadImage(image))
})

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
        const tempDataContainer = document.querySelector(".tempDataContainer");
        const mapElement = document.querySelector("#map");
        if (!container.classList.contains("expand")) {
            //container.classList.toggle("expand");
            //tempDataContainer.classList.toggle("expand");

        }

        const location = document.querySelector("#location");
        const countryCode = weatherData.sys.country;
        location.textContent = `${weatherData.name}, ${countryCode}`;
        const temperature = document.querySelector("#temperature");
        temperature.textContent = `Temp: ${weatherData.main.temp}℃`;
        const weatherCondition = document.querySelector("#condition");
        weatherCondition.textContent = weatherData.weather[0].description;

        const humidity = document.querySelector("#humidity");
        humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
        const maxMinTemp = document.querySelector("#maxMinTemp");
        maxMinTemp.textContent = `Min: ${weatherData.main.temp_min}℃, Max: ${weatherData.main.temp_max}℃ `;
        let lat = weatherData.coord.lat;
        let lon = weatherData.coord.lon;

        const camera = map.getFreeCameraOptions();
        let position = [lon, lat];
        const altitude = 3000;

        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            `${weatherData.name}, ${countryCode}, Temp: ${weatherData.main.temp}℃, ${weatherData.weather[0].description}, Humidity: ${weatherData.main.humidity}%, Min: ${weatherData.main.temp_min}℃, Max: ${weatherData.main.temp_max}℃`
        );
        const el = document.createElement("div");
        el.id = "marker";
        new mapboxgl.Marker(el)
            .setLngLat(position)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);

        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
        camera.lookAtPoint([lon, lat]);
        map.setFreeCameraOptions(camera);

        //const images = importAll(require.context("./Assets", false, /\.png/));
        let weatherElement = document.querySelector("#marker");
        const weatherIcon = weatherData.weather[0].icon;
        console.log(weatherIcon);
        console.log(images["03d.png"])
        if (weatherIcon == "04n" || weatherIcon == "04d") {
            weatherElement.style.backgroundImage = `url('${images["04d.png"]}')`;
        } else if (weatherIcon == "03d" || weatherIcon == "03n") {
            weatherElement.style.backgroundImage = `url('${images["03d.png"]}')`;
        } else if (weatherIcon == "09d" || weatherIcon == "09n") {
            weatherElement.style.backgroundImage = `url('${images["09d.png"]}')`;
        } else if (weatherIcon == "11d" || weatherIcon == "11n") {
            weatherElement.style.backgroundImage = `url('${images["11d.png"]}')`;
        } else if (weatherIcon == "13n" || weatherIcon == "13d") {
            weatherElement.style.backgroundImage = `url('${images["13d.png"]}')`;
        } else if (weatherIcon == "50n" || weatherIcon == "50d") {
            weatherElement.style.backgroundImage = `url('${images["50d.png"]}')`;
        } else {
            weatherElement.style.backgroundImage = `url('${images[`${weatherIcon}.png`]}')`;
            //weatherElement.src = images[`${weatherIcon}.png`];
        }
    } catch (error) {
        //throw error
        console.log(error);
        if ((locationInput.value = "")) {
            locationInput.reportValidity();
        } else if (error instanceof TypeError) {
            locationInput.setCustomValidity("Invalid City");
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
