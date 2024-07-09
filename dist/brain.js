'use strict';

const api_key = "###########################";
const api_url = "https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric";

// Get the current date
const date = new Date();

// Destructure the relevant components
const [currentDay, currentDate, currentMonth] = [date.getDay(), date.getDate(), date.getMonth()];

// Arrays for days and months
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Construct the formatted date string
const formattedDate = `${days[currentDay]} ${currentDate}, ${months[currentMonth]}`;

// Set the innerHTML of the element with class 'date'
document.getElementById("date").innerHTML = formattedDate;



async function checkWeather(){
    const response = await fetch(api_url + `&appid=${api_key}`);
    var data = await response.json();
    console.log(data);
    document.getElementById("city-country").innerHTML = data.name + ", " + data.sys.country;
    document.getElementById("temp-temp").innerHTML = data.main.temp;
    document.getElementById("min-temp").innerHTML = data.main.temp_min;
    document.getElementById("max-temp").innerHTML = data.main.temp_max;
}

checkWeather();
