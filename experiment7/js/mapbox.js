mapboxToken ='pk.eyJ1IjoibmF0ZXZhbGxleSIsImEiOiJjbTdqdWFoMTYwMGloMmlweGlsZjlpejhiIn0.naBIKkhEZa88gFOM6WQ41w';
mapboxgl.accessToken = mapboxToken;
  
const mapbox = new mapboxgl.Map({
	container: 'mapbox', // id of your HTML container
	style: 'mapbox://styles/mapbox/streets-v12', // change style here
	center: [-98.5795, 39.8283], // USA center (longitude, latitude)
	zoom: 3
});

function geoSuccess(position) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	getCityFromCoords(latitude, longitude);
}

function geoError() {
	console.warn("Unable to retrieve location.");
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

// -----------------------------------------------------
// ---- Geolocation ----
// -----------------------------------------------------
// Add GeolocateControl to the map
const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: false
    },
    trackUserLocation: false, // Continuously track user location
    showUserHeading: false, // Display user's heading direction
	showUserLocation: true,
});

// Center the map on the user's location once located
geolocateControl.on('geolocate', (e) => {
	const userLocation = [e.coords.longitude, e.coords.latitude];
    mapbox.flyTo({ center: userLocation, zoom: 7 });
	// geolocateControl.trackUserLocation = true;
	geolocateControl.showUserLocation = true;
	usingGeoLoc = true;
	// console.log("turning ON location tracking");

	// Call geoSuccess with the position
    geoSuccess(e);
});

// Handle error
geolocateControl.on('error', (err) => {
    console.error("Geolocation error:", err);
    geoError(err);
});

// Add the geoLocation button to the map
mapbox.addControl(geolocateControl);


// -----------------------------------------------------
// ---- Select Location ----
// -----------------------------------------------------
const radiusInKm = 15; // Set the radius of drawn circle in kilometers
let marker = null;
let circleSourceId = "circle-source";
let circleLayerId = "circle-layer";
let usingGeoLoc = false;

// Handle user click to place marker and circle
mapbox.on("click", (e) => {
	

    const clickedCoords = [e.lngLat.lng, e.lngLat.lat];
	getCityFromCoords(clickedCoords[1], clickedCoords[0]);
	
    // Remove old marker and circle if it exists
    removePinGraphics();
	
    // Place a new marker
    marker = new mapboxgl.Marker().setLngLat(clickedCoords).addTo(mapbox);
    console.log("Marker placed at:", clickedCoords);


	// Hide user location puck when map is clicked
	// [WIP] doesn't work
	if (usingGeoLoc) {
		geolocateControl.trackUserLocation = false;
		geolocateControl.showUserLocation = false;
		// console.log("turning Off location tracking");
		usingGeoLoc = false;
	}

    const circleGeoJSON = createGeoJSONCircle(clickedCoords, radiusInKm);

    // Add the circle to the map
    mapbox.addSource("circle", circleGeoJSON);

    mapbox.addLayer({
        "id": "circle-layer",
        "type": "fill",
        "source": "circle",
        "paint": {
            "fill-color": "rgb(0, 174, 255)",
            "fill-opacity": 0.3,
        }
    });

});

function removePinGraphics() {
	if (marker) marker.remove();
	if (mapbox.getLayer("circle-layer")) {
        mapbox.removeLayer("circle-layer");
    }
    if (mapbox.getSource("circle")) {
        mapbox.removeSource("circle");
    }
}

// Code from:
// https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js/39006388#39006388
const createGeoJSONCircle = function(center, radiusInKm, points) {
    if(!points) points = 64;

    let coords = {
        latitude: center[1],
        longitude: center[0]
    };

    let km = radiusInKm;

    let ret = [];
    let distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    let distanceY = km/110.574;

    let theta, x, y;
    for(let i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
};
