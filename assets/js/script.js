let searchButton = $('#search-button');
let searchInput = $('#search-input');
let listGroup = $('#history');
let todaySection = $('#today');
let forcast = $('#forecast');
let divContainer = $('<div>');
let rowContainer = $('<div>');

// Check if the localstorage has existing data
function checkLSData() {
  for (let i = 1; i < localStorage.length + 1; i++) {
    let lsCity = localStorage.getItem(i);
    if (i === 1) {
      // Display the city and current weather if the localstorage has value
      displayCurrentForcast(lsCity);
      // Diplay the 5 day weather forcast
      displayForcast(lsCity);
    }
    // Create the button element and set the text to city name
    btnEl = $('<button>').addClass('btn btn-secondary mb-3 text-capitalize').text(lsCity);
    btnEl.attr('data-city', lsCity);
    listGroup.append(btnEl); // Append the button to the list button group
  }
}

checkLSData();

// Displays the current weather when user enters the city and clicks search button
searchButton.on('click', function (event) {
  event.preventDefault();
  cityExists = 0;
  let city = searchInput.val().trim();

  // Loop to check if the city exists in the local storage
  for (let i = 1; i <= localStorage.length; i++) {
    if (localStorage.getItem(i) === city) {
      cityExists++;
    }
  }

  // If the city doesn't exist in the local storage, call function displayCurrentForcast(city) and displayForcast(city)
  if (cityExists === 0) {
    localStorage.setItem(localStorage.length + 1, city);
    displayCurrentForcast(city);
    displayForcast(city);
    let btnEl = $('<button>').addClass('btn btn-secondary mb-3 text-capitalize').text(city);
    // Append the button to the list button group below the search form
    btnEl.attr('data-city', city);
    listGroup.append(btnEl);
  }
  searchInput.val('');
});


function displayCurrentForcast(city) {

  // Create variable queryURL and store the URL with parameters city and appid to make an API call
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6a43ea209a0fd6d7d6a35882a4db10c4`;

  //  Method used to fetch a resource
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    }).then(function (result) {

      // Create h2 element and set text to city name and the current date
      const date = dayjs().format('D/M/YYYY');
      let h2El = $('<h2>');
      h2El.text(`${city} (${date})`);
      h2El.addClass('float-start text-capitalize');

      // Get the icon from the API response and add it into an <img> tag 
      let icon = result.weather[0].icon;
      iconSrc = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
      iconToday = $('<img>');
      iconToday.addClass('iconToday').attr('src', iconSrc);

      // Get the temperature value from the API response and add into a <p> tag
      let temperature = Math.floor(result.main.temp - 273.15);
      let pTemp = $('<p>');
      pTemp.text(`Temperature: ${temperature} °C`);

      // Get the wind speed value from the API response and add into a <p> tag
      let wind = result.wind.speed * 3.6;
      let pWind = $('<p>');
      pWind.text(`Wind: ${wind.toFixed(2)} KPH`);

      // Get the humidity value from the API response and add into a <p> tag
      let humidity = result.main.humidity;
      let pHumidity = $('<p>');
      pHumidity.text(`Humidity: ${humidity} %`);

      // Append elements to today section
      todaySection.empty().append(h2El, iconToday, pTemp, pWind, pHumidity).css('border', '1px solid');

    });
}

function displayForcast(city) {
  
  // Create variable queryURL and store the URL with parameters city and appid to make an API call
  let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6a43ea209a0fd6d7d6a35882a4db10c4`;
  rowContainer.empty();
  divContainer.empty();
  forcast.empty();

  //  Method to call 5 day / 3 hour forecast data
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    }).then(function (result) {

      let h3El = $('<h3>');
      h3El.text('5-day Forcasts:').addClass('w-100');
      forcast.append(h3El);

      //  Loop through the 3 hour forecast data and increase the count by 8 to get the daily forecast 
      // (24h / 3h = 8h)
      for (let i = 0; i < 40; i += 8) {
        // Get the icon from the API response and add it into an <img> tag 
        let icon = result.list[i].weather[0].icon;
        iconForcast = $('<img>');
        iconSrc = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
        iconForcast.addClass('iconToday').attr('src', iconSrc);

        // Get the date from the API response and add it into <h4> tag 
        let cityDate = result.list[i].dt_txt;
        let date = dayjs(cityDate).format('D/M/YYYY');
        let h4El = $('<h4>');
        h4El.text(date);

        // Get the temperature value from the API response and add it into <p> tag 
        let temperature = Math.floor(result.list[i].main.temp - 273.15);
        let pTemp = $('<p>');
        pTemp.text(`Temperature: ${temperature} °C`);

        // Get the wind speed value from the API response and add it into <p> tag 
        let wind = result.list[i].wind.speed * 3.6;
        let pWind = $('<p>');
        pWind.text(`Wind: ${wind.toFixed(2)} KPH`);

        // Get the humidity value from the API response and add it into <p> tag 
        let humidity = result.list[i].main.humidity;
        let pHumidity = $('<p>');
        pHumidity.text(`Humidity: ${humidity} %`);

        // Create divCol variable and append elements to display 5 day weather forecast
        let divCol = $('<div>');
        divCol.addClass('col-sm col-xs-12 p-3 bg-forcasts text-white rounded-2').css('border', '3px solid #fff')
        divCol.append(h4El, iconForcast, pTemp, pWind, pHumidity);

        // Append divCol to rowContainer
        rowContainer.append(divCol).addClass('row m-0');

        // Append rowContainer to forcast section
        forcast.append(rowContainer);

      }
    });
}

