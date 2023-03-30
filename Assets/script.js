// Global variables
var apiKey = "7e054b8b09dd564048c883ccd7c011b6";
var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var searchHistoryEl = document.querySelector("#search-history");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");

// Event listener for the search form submission
searchFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityName = cityInputEl.value.trim().toUpperCase();
  if (cityName !== "") {
    searchWeather(cityName);
  }
});

// Function to search for weather data
function searchWeather(cityName) {
  // Current weather API URL
  var currentWeatherApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=metric";

  // Fetch current weather data
  fetch(currentWeatherApiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // Display current weather data
        displayCurrentWeather(data);

        // Save city name to search history
        saveSearchHistory(cityName);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });

  // 5-day forecast API URL
  var forecastApiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=metric";

  // Fetch 5-day forecast data
  fetch(forecastApiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // Display 5-day forecast data
        displayForecast(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

// Function to display current weather data
function displayCurrentWeather(data) {
  var city = data.name;
  var date = new Date(data.dt * 1000).toLocaleDateString();
  var iconUrl =
    "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  var temp = data.main.temp;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  var html =
    "<h1>" +
    city +
    " (" +
    date +
    ") " +
    "<img src='" +
    iconUrl +
    "' alt='" +
    data.weather[0].description +
    "'></h1>" +
    "<p>Temperature: " +
    temp +
    " &deg;C</p>" +
    "<p>Humidity: " +
    humidity +
    "%</p>" +
    "<p>Wind Speed: " +
    windSpeed +
    " m/s</p>";

  currentWeatherEl.innerHTML = html;
  currentWeatherEl.classList.add("current-weather");
}

// Function to display 5-day forecast data
function displayForecast(data) {
  var forecastItems = data.list.filter(function (item) {
    return item.dt_txt.includes("12:00:00");
  });

  var html = "<h2>5-Day Forecast:</h2>";

  forecastItems.forEach(function (item) {
    var date = new Date(item.dt * 1000).toLocaleDateString();
    var iconUrl =
      "https://openweathermap.org/img/w/" + item.weather[0].icon + ".png";
    var temp = item.main.temp;
    var windSpeed = item.wind.speed;

    html +=
      "<div>" +
      "<h5>" +
      date +
      "</h5>" +
      "<img src='" +
      iconUrl +
      "' alt='" +
      item.weather[0].description +
      "'>" +
      "<p>Temp: " +
      temp +
      " &deg;C</p>" +
      "<p>Humidity: " +
      item.main.humidity +
      "%</p>" +
      "<p>Wind Speed: " +
      windSpeed +
      " m/s</p>" +
      "</div>";
  });

  forecastEl.innerHTML = html;
  forecastEl.classList.add("forecast");
}

// funtion to save search history to local storage
function saveSearchHistory(cityName) {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.push(cityName);
  // push seachHistory array to a new array and remove duplicates from the new array and then set the new array to local storage
  var searchHistoryNoDuplicates = [];
  searchHistory.forEach(function (cityName) {
    if (!searchHistoryNoDuplicates.includes(cityName)) {
      searchHistoryNoDuplicates.push(cityName);
    }
  });
  
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryNoDuplicates)
  );

  displaySearchHistory();
}

// funtion that creates buttons for each city in the search history array and displays them on the page in the search-history div
function displaySearchHistory() {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  var html = "<h2>Search History</h2>";
  searchHistory.forEach(function (cityName) {
    html += "<button class=button>" + cityName + "</button>";
  });

  searchHistoryEl.innerHTML = html;
}

// funtion to display the weather and forecast for the city button that was clicked in the search history div on the page
function displayWeatherFromHistory(event) {
  var cityName = event.target.textContent;
  searchWeather(cityName);
}

// event listener for the search history div on the page
searchHistoryEl.addEventListener("click", displayWeatherFromHistory);

// display search history on page load
displaySearchHistory();

// funtion to clear the search history from local storage and the page
function clearSearchHistory() {
  localStorage.removeItem("searchHistory");
  displaySearchHistory();
}

// event listener for the clear search history button
document
  .querySelector("#clear-history")
  .addEventListener("click", clearSearchHistory);

  