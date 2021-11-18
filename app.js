//  earthquake data for the past month, updated every minute
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(earthquakeUrl).then(createEarthquakesLayer);

var mapCenter = [39.9283, -98.5795];
var mapZoom = 5;

function createMap(markerLayer) {

    // Create the tile layer that will be the background of our map.
    var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var myMap = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        layers: [streetMapLayer, markerLayer]
    });

    var baseMap = {
        "Street Map": streetMapLayer
    };

    var earthquakeOverlayMap = {
        "Earthquakes": markerLayer
    };

    L.control.layers(baseMap, earthquakeOverlayMap, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
};


function createEarthquakesLayer(response) {

    var earthquakes = response.features;

    var earthquakeMarkers = [];

    for (var i = 0; i < earthquakes.length; i++) {

        var earthquake = earthquakes[i];
        var depth = earthquake.geometry.coordinates[2];
        var latLon = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
        var mag = earthquake.properties.mag;

        //default color is white
        var color = '#FDFEFE'

        if (depth < 10){
            // dark green
            color = '#1D8348';
        } else if (depth < 30){
            // light green
            color = '#82E0AA';
        } else if (depth < 50){
            // light yellow
            color = '#F9E79F';
        } else if (depth < 70){
            // orange
            color = '#F39C12';
        } else if (depth < 90){
            // light red
            color = '#E74C3C';
        } else {
            // red
            color = '#78281F';
        };

        var earthquakMarker = L.circle(latLon, {
            color: color,
            fillColor: color,
            fillOpacity: 0.75,
            radius: adjustMag(mag)
        }).bindPopup(`<h3>Location: ${earthquake.properties.place}</h3><hr><h3>Magnitude: ${mag}</h3><br><h3>Depth: ${depth}</h3><br><h3>Lat, Lon: ${latLon[0]}, ${latLon[1]}</h3>`);

        earthquakeMarkers.push(earthquakMarker);
    };

    var earthquakeLayerGroup = L.layerGroup(earthquakeMarkers);

    createMap(earthquakeLayerGroup);

}

function adjustMag(mag) {
    
    var inverseMag = Math.pow(10, mag)
    
    return Math.sqrt(inverseMag) * 200;
};

function getColor(d) {
    return d > 90 ? '#78281F' :
           d > 70  ? '#E74C3C' :
           d > 50  ? '#F39C12' :
           d > 30  ? '#F9E79F' :
           d > 10   ? '#82E0AA' :
                      '#1D8348';
};
