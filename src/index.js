import './cssReset.css';
import './style.css';


const getWeather = async () =>{
    const locationInput = document.querySelector("#search")
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationInput.value}&appid=646b40771116a971c76a3a8a720592c6&units=metric`, {mode:"cors"})
        const weatherData = await response.json()
        console.log(locationInput.value)
        console.log(weatherData.main.temp)


        const container = document.querySelector(".searchContainer")
        container.classList.toggle("expand")
    } catch (error){
       //throw error
      // console.log(error)
       if (locationInput.value = ""){
        locationInput.reportValidity()
       } else if (error instanceof TypeError){
           locationInput.setCustomValidity("Invalid Location")
            locationInput.reportValidity()
       }
    }
}
    


const searchButton = document.querySelector("#searchButton")
searchButton.onclick = function(){getWeather()}