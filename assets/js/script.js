let searchButton = $('#search-button');
let searchInput = $('#search-input');
let listGroup = $('#history');
let todaySection = $('#today');

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

  // If the city doesn't exist in the local storage, call function displayCurrentForcast(city)
  if (cityExists === 0) {
    localStorage.setItem(localStorage.length + 1, city);
    displayCurrentForcast(city);
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

      // Get the temperature from the API response and add into a <p> tag
      let temperature = Math.floor(result.main.temp - 273.15);
      let pTemp = $('<p>');
      pTemp.text(`Temperature: ${temperature} °C`);

      // Get the temperature from the API response and add into a <p> tag
      let wind = result.wind.speed * 3.6;
      let pWind = $('<p>');
      pWind.text(`Wind: ${wind.toFixed(2)} KPH`);

      // Get the humidity from the API response and add into a <p> tag
      let humidity = result.main.humidity;
      let pHumidity = $('<p>');
      pHumidity.text(`Humidity: ${humidity} %`);

      // Append elements to today section
      todaySection.empty().append(h2El, iconToday, pTemp, pWind, pHumidity).css('border', '1px solid');

    });
}

