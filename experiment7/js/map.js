mapboxgl.accessToken = 'pk.eyJ1IjoibmF0ZXZhbGxleSIsImEiOiJjbTdqdWFoMTYwMGloMmlweGlsZjlpejhiIn0.naBIKkhEZa88gFOM6WQ41w'; // get this from mapbox.com
  
const mapbox = new mapboxgl.Map({
	container: 'mapbox', // id of your HTML container
	style: 'mapbox://styles/mapbox/streets-v12', // change style here
	center: [-98.5795, 39.8283], // USA center (longitude, latitude)
	zoom: 3
});