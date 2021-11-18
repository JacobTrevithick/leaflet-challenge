//  earthquake data for the past month, updated every minute
// var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// d3.json(earthquakeUrl).then(createEarthquakesLayer);



// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
L.map("map-id", {
    center: [45.52, -122.67],
    zoom: 13
  });
  
// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

// Creating a new marker:
// We pass in some initial options, and then add the marker to the map by using the addTo() method.
// var marker = L.marker([45.52, -122.67], {
// draggable: true,
// title: "My First Marker"
// }).addTo(myMap);

// Binding a popup to our marker
// marker.bindPopup("Hello There!");
  
// var mapCenter = [39.9283, -98.5795];
// var mapZoom = 12;

// var myMap  = L.map('map-id', {
//     center: mapCenter,
//     zoom: mapZoom
// });

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);


// d3.json(earthquakeUrl).then(function(data){
//     var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     });
    
//     L.map('map', {
//         center: mapCenter,
//         zoom: mapZoom,
//         layers: [streetMapLayer]
//     });
// });




// function createMap(markerLayer) {

//     // Create the tile layer that will be the background of our map.
//     var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     });

//     var myMap = L.map('map', {
//         center: mapCenter,
//         zoom: mapZoom,
//         layers: [streetMapLayer, markerLayer]
//     });

//     var baseMap = {
//         "Street Map": streetMapLayer
//     };

//     var earthquakeOverlayMap = {
//         "Earthquakes": markerLayer
//     };

//     L.control.layers(baseMap, earthquakeOverlayMap, {
//         collapsed: false
//     }).addTo(myMap);
// };


// function createEarthquakesLayer(response) {

//     var earthquakes = response.features;

//     var earthquakeMarkers = [];

//     for (var i = 0; i < earthquakes.length; i++) {

//         var earthquake = earthquakes[i];
//         var depth = earthquake.geometry.coordinates[2];
//         var latLon = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
//         var mag = earthquake.properties.mag;
//         // console.log(mag);
//         //default color is white
//         var color = '#FDFEFE'

//         if (depth < 10){
//             // dark green
//             color = '#1D8348';
//         } else if (depth < 30){
//             // light green
//             color = '#82E0AA';
//         } else if (depth < 50){
//             // light yellow
//             color = '#F9E79F';
//         } else if (depth < 70){
//             // orange
//             color = '#F39C12';
//         } else if (depth < 90){
//             // light red
//             color = '#E74C3C';
//         } else {
//             // red
//             color = '#78281F';
//         };

//         var earthquakMarker = L.circle(latLon, {
//             color: color,
//             fillColor: color,
//             fillOpacity: 0.75,
//             radius: adjustMag(mag)
//         }).bindPopup(`<h3>Location: ${earthquake.properties.place}</h3><hr><h5>Magnitude: ${mag}</h5><br><h5>Depth: ${depth}</h5><br><h5>Lat, Lon: ${latLon[0]}, ${latLon[1]}</h5>`);

//         earthquakeMarkers.push(earthquakMarker);
//     };

//     var earthquakeLayerGroup = L.layerGroup(earthquakeMarkers);

//     createMap(earthquakeLayerGroup);

// }

// function adjustMag(mag) {
    
//     var inverseMag = Math.pow(10, mag)
    
//     return inverseMag * 100;
// }
