'use strict'; // enables strict mode, which provides enhanced error checking and helps to catch common coding mistakes.

const api_key = "2d0e6b5bc0d83665ab4827fe3b2d893c"; // API key
const api_url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="; // API default URL

const searchInp = document.getElementById("searchInp"); // search bar element
const searchBtn = document.getElementById("searchBtn"); // search icon element
const currLocBtn = document.getElementById("currlocbtn"); // current location element

const dropdownMenu = document.getElementById('ddmenu'); // Dropdown menu element
const dd1 = document.getElementById('1stDD');  // Dropdown list element
const dd2 = document.getElementById('2ndDD'); // Dropdown list element
const dd3 = document.getElementById('3rdDD'); // Dropdown list element

function showHideDD(){ // To show or hide dropdown menu according to defined conditions using event listner
    if(sessionStorage.length > 1){
        searchInp.addEventListener('click', () => {
            dropdownMenu.classList.remove('hidden');
        });
    }

    document.addEventListener('click', (event) => {
        if (!searchInp.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.add('hidden');
        }
    })
}

document.addEventListener('DOMContentLoaded', () => { // Event listener added to Content Load to check if there is any saved city in session storage and display dropdown accordingly
    if(sessionStorage.length > 1){ // if there are previously contained cities in Session Storage, then assigning them to Dropdown list elements
        dd1.innerHTML = sessionStorage.getItem("1");
        dd2.innerHTML = sessionStorage.getItem("2");
        dd3.innerHTML = sessionStorage.getItem("3");
    }

    // Event listeners added to each list item of dropdown to search that item weather data
    dd1.addEventListener('click',() => {
        checkWeather(dd1.textContent); // function to search that city weather data
        searchInp.value = dd1.textContent; // displaying that city name in search as well
    })
    dd2.addEventListener('click',() => {
        checkWeather(dd2.textContent);
        searchInp.value = dd2.textContent;
    })
    dd3.addEventListener('click',() => {
        checkWeather(dd3.textContent);
        searchInp.value = dd3.textContent;
    })

    showHideDD(); // calling this function to show or hide Dropdown accordingly
})

const displayError = (message) => { // Function to display error like an alert message when needed
    alert(message);
};

searchBtn.addEventListener("click",() => { // Added event listener on search icon/button to call function to display its weather data
    const cityName = searchInp.value.trim();
    if (!cityName) {
        displayError('City name cannot be empty.');
        return;
    }
    checkWeather(cityName);
})

searchInp.addEventListener('keydown', (event) => { // Added event listener on keydown => Enter key to call function to display its weather data
    if (event.key === 'Enter') {
        const cityName = searchInp.value.trim();
        if (!cityName) {
            displayError('City name cannot be empty.');
            return;
        }
        checkWeather(cityName);
    }
});

const useCurrentLocation = () => { // Function for getting current location of user using another API and then using it to check its weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Use a geocoding service to get the city name
        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                const cityName = data.address.city || data.address.state;
                searchInp.value = cityName;
                checkWeather(cityName);
            })
            .catch(error => {
                displayError(`Error fetching the city name:, ${error}`);
            });
        }, (error) => {
            displayError(`Error getting location:, ${error}`);
        });
    } else {
        displayError(`Geolocation is not supported by this browser.`);
    }
};

currLocBtn.addEventListener('click', useCurrentLocation); // Event listener for current location click to execute its function to get location and check its weather data

// Get the current date
const date = new Date();

// Destructure the relevant components from date
const [currentDay, currentDate, currentMonth] = [date.getDay(), date.getDate(), date.getMonth()];

// Arrays for days and months
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Construct the formatted date string
const formattedDate = `${currentDate} ${months[currentMonth]}, ${days[currentDay]}`;

// Set the innerHTML of the date element
document.getElementById("date").innerHTML = formattedDate;

// Main function calling weather API to get weather data
async function checkWeather(city){
    await fetch(api_url + city + `&appid=${api_key}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("city-country").innerHTML = data.name + ", " + data.sys.country; // updating value of city and country element
            document.getElementById("temp-text1").innerHTML = data.main.temp.toFixed(1); // updating value of main temperature
            document.getElementById("min-temp").innerHTML = data.main.temp_min.toFixed(1) + " &deg;C"; // updating value of min temperature
            document.getElementById("max-temp").innerHTML = data.main.temp_max.toFixed(1) + " &deg;C"; // updating value of max temperature

            const weatherIcon = document.getElementById("weather-icon"); // getting weather icon element

            // assigning weather icon according to description provided by API
            if(data.weather[0].main == "Clear"){
                weatherIcon.src = "../assets/weather-icons/1.png";
            }
            else if(data.weather[0].main == "Clouds"){
                weatherIcon.src = "../assets/weather-icons/4.png";
            }
            else if(data.weather[0].main == "Mist"){
                weatherIcon.src = "../assets/weather-icons/5.png";
            }
            else if(data.weather[0].main == "Drizzle"){
                weatherIcon.src = "../assets/weather-icons/6.png";
            }
            else if(data.weather[0].main == "Rain"){
                weatherIcon.src = "../assets/weather-icons/7.png";
            }
            else if(data.weather[0].main == "Thunderstorm"){
                weatherIcon.src = "../assets/weather-icons/8.png";
            }
            else if(data.weather[0].main == "Snow"){
                weatherIcon.src = "../assets/weather-icons/9.png";
            }
            else{
                weatherIcon.src = "../assets/weather-icons/2.png";
            }

            document.getElementById("feels-like").innerHTML = data.main.feels_like.toFixed(0) + " &deg;C"; // updating value of feels like element
            document.getElementById("humidity").innerHTML = data.main.humidity + "%"; // updating value of humidity element
            document.getElementById("pressure").innerHTML = data.main.pressure + " hPa"; // updating value of pressure element
            document.getElementById("visibility").innerHTML = Math.round(data.visibility/1000) + " km"; // updating value of visibility element

            // function to update Session storage according to conditions
            function updateSS(city){
                if(sessionStorage.length == 1){
                    sessionStorage.setItem("3",city);
                } else if(sessionStorage.length == 2){
                    sessionStorage.setItem("2",city);
                } else if(sessionStorage.length == 3){
                    sessionStorage.setItem("1",city);
                } else{
                    sessionStorage.setItem("3",sessionStorage.getItem("2"));
                    sessionStorage.setItem("2",sessionStorage.getItem("1"));
                    sessionStorage.setItem("1",city);
                }
            }
            updateSS(city);

            // using if condition to update dropdown list elements using session storage if condition allows
            if(sessionStorage.length > 1){
                dd1.innerHTML = sessionStorage.getItem("1");
                dd2.innerHTML = sessionStorage.getItem("2");
                dd3.innerHTML = sessionStorage.getItem("3");
            }

            // running function to show or hide DD accordingly
            showHideDD();

            // Define geographical coordinates (latitude and longitude)
            let lat = data.coord.lat;
            let lon = data.coord.lon;

            // Fetching sunrise time from a public API
            fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today&tzid=Asia/Calcutta`)
                .then(response => response.json())
                .then(data => {
                    function removeSeconds(time){
                        let [timeOnly,modifier] = time.split(" ");
                        let [hr,min,sec] = timeOnly.split(":");
                        return hr+":"+min+" "+modifier;
                    }

                    document.getElementById("sunrise-value").innerHTML = removeSeconds(data.results.sunrise); // updating value of Sunrise element
                    document.getElementById("sunset-value").innerHTML = removeSeconds(data.results.sunset); // updating value of Sunset element
                })
                .catch(error => displayError(`Error fetching sunrise and sunset time:, ${error}`));

            // Fetching AQI from same API provider but with different link
            fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`)
                .then(response => response.json())
                .then(data => {
                    // updating values accordingly
                    document.getElementById("pm25-value").innerHTML = data.list[0].components.pm2_5;
                    document.getElementById("so2-value").innerHTML = data.list[0].components.so2;
                    document.getElementById("no2-value").innerHTML = data.list[0].components.no2;
                    document.getElementById("o3-value").innerHTML = data.list[0].components.o3;
                })
                .catch(error => displayError(`Error fetching AQI values:, ${error}`));

            // Fetching weekly forecast from same API provider but with different link
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
            .then(response => response.json())
            .then(data => {
                // function to assign weather icon
                function getIcon(mainIcon){
                    if(mainIcon == "Clear"){
                        return "../assets/weather-icons/1.png";
                    }
                    else if(mainIcon == "Clouds"){
                        return "../assets/weather-icons/4.png";
                    }
                    else if(mainIcon == "Mist"){
                        return "../assets/weather-icons/5.png";
                    }
                    else if(mainIcon == "Drizzle"){
                        return "../assets/weather-icons/6.png";
                    }
                    else if(mainIcon == "Rain"){
                        return "../assets/weather-icons/7.png";
                    }
                    else if(mainIcon == "Thunderstorm"){
                        return "../assets/weather-icons/8.png";
                    }
                    else if(mainIcon == "Snow"){
                        return "../assets/weather-icons/9.png";
                    }
                    else{
                        return "../assets/weather-icons/2.png";
                    }
                }

                // function to get weather forecast data
                function getForecastData(){
                    for(let i=0; i<40; i++){ // looping through the whole forecast data to find our desirable outputs
                        let [foundDate, foundTime] = data.list[i].dt_txt.split(" "); // splitting date from data to use later
                        let [yr, mn, dt] = foundDate.split("-"); // splitting year, month and date to use later
                        // adding conditions for every successive day forecast
                        if((currentDate + 1 == dt || "01" == dt) && "00:00:00" == foundTime){
                            document.getElementById("forecast-icon-1").src = getIcon(data.list[i].weather[0].main); // using get icon function to get weather icon and updating it also
                            document.getElementById("forecast-temp-1").innerHTML = `${data.list[i].main.temp.toFixed(1)}&deg;<span class="text-lg md:text-3xl lg:text-4xl xl:text-5xl">C</span>`; // updating forecast temperature data for that day
                            document.getElementById("forecast-date-1").innerHTML = `${dt} ${months[mn-1]}, ${yr}`; // using previously splitted date to generate full date in our format
                        }
                        if((currentDate + 2 == dt || "02" == dt) && "00:00:00" == foundTime){
                            document.getElementById("forecast-icon-2").src = getIcon(data.list[i].weather[0].main);
                            document.getElementById("forecast-temp-2").innerHTML = `${data.list[i].main.temp.toFixed(1)}&deg;<span class="text-lg md:text-3xl lg:text-4xl xl:text-5xl">C</span>`;
                            document.getElementById("forecast-date-2").innerHTML = `${dt} ${months[mn-1]}, ${yr}`;
                        }
                        if((currentDate + 3 == dt || "03" == dt) && "00:00:00" == foundTime){
                            document.getElementById("forecast-icon-3").src = getIcon(data.list[i].weather[0].main);
                            document.getElementById("forecast-temp-3").innerHTML = `${data.list[i].main.temp.toFixed(1)}&deg;<span class="text-lg md:text-3xl lg:text-4xl xl:text-5xl">C</span>`;
                            document.getElementById("forecast-date-3").innerHTML = `${dt} ${months[mn-1]}, ${yr}`;
                        }
                        if((currentDate + 4 == dt || "04" == dt) && "00:00:00" == foundTime){
                            document.getElementById("forecast-icon-4").src = getIcon(data.list[i].weather[0].main);
                            document.getElementById("forecast-temp-4").innerHTML = `${data.list[i].main.temp.toFixed(1)}&deg;<span class="text-lg md:text-3xl lg:text-4xl xl:text-5xl">C</span>`;
                            document.getElementById("forecast-date-4").innerHTML = `${dt} ${months[mn-1]}, ${yr}`;
                        }
                        if((currentDate + 5 == dt || "05" == dt) && "00:00:00" == foundTime){
                            document.getElementById("forecast-icon-5").src = getIcon(data.list[i].weather[0].main);
                            document.getElementById("forecast-temp-5").innerHTML = `${data.list[i].main.temp.toFixed(1)}&deg;<span class="text-lg md:text-3xl lg:text-4xl xl:text-5xl">C</span>`;
                            document.getElementById("forecast-date-5").innerHTML = `${dt} ${months[mn-1]}, ${yr}`;
                        }
                    }
                }
                getForecastData(); // calling function to generate forecast data whenever we search for city
            })
            .catch(error => displayError(`Error fetching 5-Days Forecast:, ${error}`));

        })
        .catch(error => displayError(`Invalid location entered: "${city}". Please enter a valid location name. ${error}`));
}