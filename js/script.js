'use strict';

const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
const APIKey = '6b1b202d0dd34b48a92754a11f583d39';
const weekdays = {
	0: 'Dom',
	1: 'Seg',
	2: 'Ter',
	3: 'Qua',
	4: 'Qui',
	5: 'Sex',
	6: 'Sáb'
}
				
getForecast('Recife');
//These two code below helped to define the load icon at the right moment, that is when the page is searching to a new city.
$('#forecast').css('display', '');
$('#loader').css('display', 'none');
//Below is defined an event when the search button is clicked or required by a keypress.
$('#search').click(function(event) {
	
	event.preventDefault();
	console.log(event);

	const newCity = $('#city').val();
	getForecast(newCity);
});
//This function is one of the most important things for page, cause is from here that the load page is based
//In the start, there are two functions, that are to clear fields of next days below the main card Forecast when is searched a new city
//and the other one is to show the metric unit based on toggle switch place, respectively.
//The others two are to complete the function to show the load icon in the right moment.
//Following the $ajax is important to load data and make the requirement to API based on APIkey, city, and etc. There is a thing in this that is
//the page don't load if is builded another function with $ajax to help in the code design. So, my solution was to broke something into him
//to make more smaller, example pageLoadSuccess
function getForecast(city) {

	pageLoadSucessSupport();

	$.ajax( {

		url: baseURL,

		data: {

			key: APIKey,
			city: city,
			units: 'M',
			lang: 'pt'
		},	

		success: function(result) {

			const forecast = result.data;
			const today = forecast[0];
			const nextDays = forecast.slice(1);

			console.log(forecast);
			console.log(today);
			console.log(nextDays);

			pageLoadSuccess(result, today, nextDays);
		},

		error: function(error) {

			console.log(error.responseText);
		}
	});
//My solution to toggle switch was to define two differents $ajax, but with a little difference, that is the unit.
//The consequence is that the speed is changed as well (I tried), and when the toggle is selected in left, the search is only in the Censius unit
	$(function() {
  		$("#toggle").click(function() {
    		if ($(this).is(":checked")) {

    			pageLoadSucessSupport();
    			changeInfo1();

    			$.ajax( {

					url: baseURL,

					data: {

						key: APIKey,
						city: city,
						units: 'M',
						lang: 'pt'
					},

					success: function(result) {

						const forecast = result.data;
						const today = forecast[0];
						const nextDays = forecast.slice(1);

						pageLoadSuccess(result, today, nextDays);
					},

					error: function(error) {

						console.log(error.responseText);
					}
				});

   			} else {

    			pageLoadSucessSupport();
    			changeInfo2();	

   				$.ajax( {

					url: baseURL,

					data: {

						key: APIKey,
						city: city,
						units: 'I',
						lang: 'pt'
					},	

					success: function(result) {

						const forecast = result.data;
						const today = forecast[0];
						const nextDays = forecast.slice(1);

						pageLoadSuccess(result, today, nextDays);
					},

					error: function(error) {

						console.log(error.responseText);
					}
				});
    	}
  	});
});}	

function clearFields() {

	$('#next-days').empty();
}
//Depending of the toggle selected, the scales change.
function changeInfo1() {

	$('#tempCs').show();
    $('#spdKMH').show();
    $('#tempFt').hide();
    $('#spdMPH').hide();	
}

function changeInfo2() {

	$('#tempCs').hide();
    $('#spdKMH').hide();
    $('#tempFt').show();
    $('#spdMPH').show();
}

function pageLoadSuccess(result, today, nextDays) {

	$('#forecast').css('display', '')
	$('#loader').css('display', 'none')
	$('#city-name').text(result.city_name);

	displayToday(today);
	displayNextDays(nextDays);
}

function pageLoadSucessSupport() {

	clearFields();
	changeInfo1();

	$('#loader').css('display', '');
	$('#forecast').css('display', 'none');
}
//This function defines the main info card to today forecast
function displayToday(today) {

	const temperature = Math.round(today.temp);
	const windSpeed = Math.round(today.wind_spd);
	const humidity= today.rh;
	const weather = today.weather.description;
	const icon = today.weather.icon;

	const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
	$('#weather-icon').attr('src', iconURL)

	$('#current-temperature').text(temperature);
	$('#current-wind').text(windSpeed);
	$('#current-humidity').text(humidity);
	$('#current-weather').text(weather);


}
//And this other one is to define the temperature info to the next 15 days
function displayNextDays(nextDays) {

	for(let i = 0; i < nextDays.length; i = i+1) {

		const day = nextDays[i];
		const maxTemp = Math.round(day.max_temp);
    	const minTemp = Math.round(day.min_temp);
   		const date = new Date(day.valid_date);
   		const weekday = weekdays[date.getUTCDay()];

		const card = $(
			`<div class="day-card">
          		<div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
          		<div class="weekday">${weekday}</div>
          		<div class="temperatures">
            		<span class="max">${maxTemp}°</span>
            		<span class="min">${minTemp}°</span>
          		</div>
        	</div>`);

    	card.appendTo('#next-days');
	}
}