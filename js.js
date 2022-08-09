// weather icon list :https://www.weatherapi.com/docs/weather_conditions.json
//API:https://api.weatherapi.com/v1/forecast.json?key=b491aed6b5c24d5ba6403542222202&q=London&days=1&aqi=no&alerts=no

//ad in return: <a href="https://www.weatherapi.com/" title="Free Weather API"><img src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0"></a>

// import { API_URL, API_KEY } from "./utils.js";

const button = document.getElementById("submit");
const searchValue = document.getElementById("inputValue");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherTempEl = document.getElementById("weatherTemp");
const weatherDayEl = document.getElementById("weatherDay");
const weatherDescriptionEl = document.getElementById("weatherDescription");
const dailyContainerEl = document.getElementById("dailyContainer");
const currentContainerEl = document.getElementById("currentContainer");
const locationEl = document.getElementById("location");
const myAlertEl = document.getElementById("myAlert");

navigator.geolocation.getCurrentPosition(success, error);
function success(position) {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  console.log(longitude, latitude);

  getApiData(longitude, latitude);
  getCityData(longitude, latitude);
}

function error(error) {
  console.log(error);
}

async function getCityData(longitude, latitude) {
  try {
    const cityName = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json?q=" +
        latitude +
        "+" +
        longitude +
        "&key=28b3c947431742229e094ec067e95b76"
    );

    currentCityData(cityName);
  } catch (error) {
    console.log(error);
  }
}

function currentCityData(cityName) {
  let mycityname = cityName.data.results[0].components;
  let { town } = mycityname;
  locationEl.innerHTML = `${town}`;
}

async function getApiData(longitude, latitude) {
  try {
    const result = await axios.get(
      "https://api.openweathermap.org/data/2.5/onecall?" +
        "lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&exclude=hourly,minutely&units=metric&appid=42d08d24aa2287eeb9badbbd8c4cac72"
    );
    console.log(result);

    showApiData(result.data.daily);
    currentApiData(result.data.current);
    groceryAlert(result.data.daily);
  } catch (error) {
    let { status, statusText } = error.response.request;
    alert("Sorry, error " + status + " exist. It means " + statusText);

    console.log(error.response);
  }
}

function myTime(dt) {
  var timestamp = dt;
  var dateFormat = new Date(timestamp);

  console.log(dateFormat);

  const unixTimestamp = dt;

  const milliseconds = unixTimestamp;

  const dateObject = new Date(milliseconds * 1000);

  const humanDateFormat = dateObject.toLocaleString();

  const dayOfWeek = dateObject.toLocaleString("en-US", { weekday: "long" });
  const MonthsOfWeek = dateObject.toLocaleString("en-US", { month: "long" });
  const dateOfWeek = dateObject.toLocaleString("en-US", { day: "numeric" });

  let newFormat = dayOfWeek + ", " + dateOfWeek + " " + MonthsOfWeek;
  return newFormat;
}

function currentApiData(current) {
  let { dt, temp, humidity } = current;
  let { description, icon } = current.weather[0];

  let newFormat = myTime(dt);
  currentContainerEl.insertAdjacentHTML(
    "afterbegin",
    `<div class="bigCard">
    <div class="uppercard">
    <div class="BigCardLeft">
       <div class="topInf" >${temp.toFixed(1) + "°C"}</div>
       <div class="middleInf" >Humidity:${humidity}%</div>
       <div class="bottomInf">${description}</div>  
    </div>
    <div class="BigCardMiddle">
    <div ><img class="iconTop" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt=""></div>
 </div>
 </div>
    <div class="BigCardBottom">
    <div class="newFormatDate">${newFormat}</div></div>
    </div>`
  );
}

function showApiData(daily) {
  // let { date, temp, humidity, daily_chance_of_rain, condition } =
  //   result.data.forecast.forecastday[0];

  const days = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thur"];
  for (let i = 0; i < days.length; i++) {}

  const d = new Date();
  let day = days[d.getDay()];

  for (let i = 0; i < daily.length - 1; i++) {
    let day = daily[i];
    let dayTemp1 = day.temp.day;
    let dayTemp = dayTemp1;

    //current data
    dailyContainerEl.insertAdjacentHTML(
      "afterbegin",
      `<div class="smallCard">
          <div class="smallCardTop">
               <div >${days[i]}</div>
          </div>
          <div class="tempSize">${dayTemp.toFixed(1)}</div>
          <div ><img class="icon" src="http://openweathermap.org/img/wn/${
            day.weather[0].icon
          }@2x.png" alt=""></div>
          <div class="smallCardBottom">
          <div class="desSize">${day.weather[0].description}</div>
          </div>
          
      </div>`
    );
  }
}

function groceryAlert(daily) {
  for (let i = 0; i < daily.length; i++) {
    let myDaily = daily[i];

    let myMain = myDaily.weather[0].main;

    console.log(myMain);
    if (myMain !== "rain") {
      myAlertEl.innerHTML = "AI Suggest: Prepare 3 days grocery";
    } else {
      myAlertEl.innerHTML = "Rain in coming days, suggest to buy EXTRA grocery";
    }
  }
}
