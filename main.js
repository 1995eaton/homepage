var time, temp, dateEl, newsPane, newsStories, gotNews;
var Weather, Forecast;
var ycomb = "http://api.ihackernews.com/page?format=jsonp&callback=hackerAppend";

var Month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function hideNews() {
  newsPane.style.opacity = "0";
}

function fadePaneOut(e) {
  if (fadeOut)
  newsPane.style.display = "none";
}
function hackerAppend(data) {
  data = data.items;
  for (var i = 0; i < data.length; ++i) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = data[i].url;
    a.innerHTML = "(" + data[i].points + ") " + data[i].title + ' <a href="https://news.ycombinator.com/item?id="' + data[i].id + '">[comments]</a>';
    li.appendChild(a);
    newsStories.appendChild(li);
  }
}
function getNews() {
  if (gotNews) return;
  var s = document.createElement("script");
  s.src = ycomb;
  document.head.appendChild(s);
  gotNews = true;
}

function showNews() {
  if (newsPane.style.opacity === "1") {
    fadeOut = true;
    return newsPane.style.opacity = "0";
  }
  getNews();
  fadeOut = false;
  newsPane.style.display = "block";
  setTimeout(function() {
    newsPane.style.opacity = "1";
  }, 5);
}

function displayWeather(data) {
  var data = data.current_observation;
  Weather.conditions.innerText = data.weather;
  Weather.city.innerText = data.display_location.full;
  Weather.temp.innerHTML = data.temperature_string.replace(/([0-9]) /g, "$1&deg;");
}
function displayForecast(data) {
  var data = data.forecast.simpleforecast.forecastday;
  for (var i = 0; i < Forecast.length; i++) {
    Forecast[i].innerHTML = "<b>" + data[i].date.weekday + "</b>: " + data[i].conditions.toLowerCase() + " with a high of " + data[i].high.fahrenheit + "&deg;F and a low of " + data[i].low.fahrenheit + "&deg;F";
  }
}

function getWeather() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/weather");
  var f = new FormData();
  f.append("arg", "get_weather");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      displayWeather(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(f);
}

function getForecast() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/weather");
  var f = new FormData();
  f.append("arg", "get_forecast");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      displayForecast(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(f);
}

function timeStart() {
  var date, d;
  function padZeroes(str) {
    return (str.length === 1) ? "0" + str : str;
  }
  (function loop() {
    date = new Date();
    d = ((date.getHours() % 12) || 12).toString() + ":" +
        padZeroes(date.getMinutes().toString()) + ":" +
        padZeroes(date.getSeconds().toString());
    time.innerHTML = d;
    dateEl.innerHTML = "<span id='date'><br>" + Month[date.getMonth()] + " " +  date.getDate() + ", " + date.getFullYear() +  "</span>";
    setTimeout(function() {
      loop();
    }, 1000);
  })();
}

function mouseDown(e) {
  if (newsPane.style.opacity === "1" && e.target.id === "pane") {
    showNews();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  time = document.getElementById("time");
  dateEl = document.getElementById("date");
  newsStories = document.getElementById("stories").firstElementChild;
  newsPane = document.getElementById("pane");
  newsPane.addEventListener("transitionend", fadePaneOut, false);
  document.addEventListener("mousedown", mouseDown, false);
  timeStart();
  Weather = {
    conditions: document.getElementById("conditions"),
    temp: document.getElementById("temp"),
    city: document.getElementById("city")
  };
  Forecast = [
    document.getElementById("day1"),
    document.getElementById("day2"),
    document.getElementById("day3"),
    document.getElementById("day4")
  ];
  getWeather();
  getForecast();
});
