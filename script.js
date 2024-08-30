const APIKEY = "f12600f3ed504f2efe43c960e7d1224e";
const searchedCitites = JSON.parse(localStorage.getItem("searchedCitites")) || [];
const searchedCititesElement = document.getElementById("seached-cities");

let form = document.querySelector("form");

function fiveDaysForecast(data) {
  let fiveDaysElement = document.getElementById("five-day-forecast-cards");
  fiveDaysElement.innerHTML = "";
  for (let i = 0; i < data.list.length; i = i + 8) {
    let date = new Date(data.list[i].dt_txt).toLocaleDateString('en-US');
    let icon = data.list[i].weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    let dataInK = data.list[i].main.temp;
    let dataInF = ((dataInK - 273.15) * 1.8 + 32).toFixed(2);
    let wind = data.list[i].wind.speed + " MPH";
    let humidity = data.list[i].main.humidity + " %";

    let newCard = `
        <div class="card">
            <h3>${date}</h3>
            <img src=${iconUrl} alt="icon" />
            <p>Temp: ${dataInF} </p>
            <p>Wind: ${wind} </p>
            <p>Humidity: ${humidity} </p>
        </div>
    `;
    fiveDaysElement.innerHTML += newCard;
  }
}

function displayCurrentWeatherData(data) {
  console.log(data);
  let dailyForecastElement = document.getElementById("daily-forecast");
  dailyForecastElement.innerHTML = "";
  let cityName = data.name;
  let icon = data.weather[0].icon;
  let iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    let date = new Date(data.dt * 1000).toLocaleDateString('en-US');
  console.log(date);
  let dataInK = data.main.temp;
  let dataInF = ((dataInK - 273.15) * 1.8 + 32).toFixed(2) + " F";
  let wind = data.wind.speed + " MPH";
  let humidity = data.main.humidity + " %";
  dailyForecastElement.innerHTML = `
        <div>
            <h2><span>${cityName}</span> <span>(${date})</span> <img src=${iconUrl} alt="icon"/> </h2>
            <p>Temp: ${dataInF} </p>
            <p>Wind: ${wind} </p>
            <p>Humidity: ${humidity} </p>

        </div>
    `;
}

function getWeatherData(lat, long) {
  let currentWeatherData = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIKEY}`;
  let fiveDaysWeatherData = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${APIKEY}`;
  fetch(currentWeatherData)
    // fetch reurns a promise which needs to be resolved using .then. reponse is not readable, so using .json will convert it into json format which will be readable
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeatherData(data);
    })
    .catch((error) => console.log(error));

  fetch(fiveDaysWeatherData)
    // fetch reurns a promise which needs to be resolved using .then. reponse is not readable, so using .json will convert it into json format which will be readable
    .then((response) => response.json())
    .then((data) => {
      fiveDaysForecast(data);
    })
    .catch((error) => console.log(error));
}

function getLatLong(cityName) {
  let getLatLongAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKEY}`;

  // fetch is an API to communicate with server side API
  fetch(getLatLongAPI)
    // fetch reurns a promise which needs to be resolved using .then. reponse is not readable, so using .json will convert it into json format which will be readable
    .then((response) => response.json())
    .then((data) => getWeatherData(data[0].lat, data[0].lon))
    .catch((error) => console.log(error));
}

form.addEventListener("submit", function (event) {
  // prevents the default behavior of the form(tries to submit the form to backend)
  event.preventDefault();

  let cityInputValue = document.getElementById("cityInput").value;
  if(!searchedCitites.includes(cityInputValue)){
    searchedCitites.push(cityInputValue);
    localStorage.setItem("searchedCitites", JSON.stringify(searchedCitites));
    displaySearchedCities();
  }
  
  getLatLong(cityInputValue);

});

function displaySearchedCities() {
    searchedCititesElement.innerHTML = "";
    searchedCitites.forEach(city => {
        let button = document.createElement("button");
        button.textContent = city;
        button.classList.add("city-button");
        button.addEventListener("click", function(){
            getLatLong(button.textContent)
        })
        searchedCititesElement.appendChild(button)
        
    })
}

displaySearchedCities();