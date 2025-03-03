mapboxToken ='pk.eyJ1IjoibmF0ZXZhbGxleSIsImEiOiJjbTdqdWFoMTYwMGloMmlweGlsZjlpejhiIn0.naBIKkhEZa88gFOM6WQ41w';
mapboxgl.accessToken = mapboxToken;
  
const mapbox = new mapboxgl.Map({
	container: 'mapbox', // id of your HTML container
	style: 'mapbox://styles/mapbox/streets-v12', // change style here
	center: [-98.5795, 39.8283], // USA center (longitude, latitude)
	zoom: 3
});

// Find city by current location
navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

function geoSuccess(position) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	getCityFromCoords(latitude, longitude);
}

function geoError() {
	console.error("Unable to retrieve location.");
}

const cityDisplay = document.querySelectorAll(".user-city");

function updateCity(city) {
	cityDisplay.forEach(span => {
		span.textContent = city;
	});
}

const getCityFromCoords = async (lat, lon) => {
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=place&access_token=${mapboxToken}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if ( data.features.length > 0 ) {
			const city = data.features[0].text;
			updateCity(city);
			console.log("City:", city);
			
			window.userCity = city;
		} else {
			console.log("No city found!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching city:", error);
	}
}