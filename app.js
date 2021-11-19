//  earthquake data for the past month, updated every minute
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var tectonicPlateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"


d3.json(earthquakeUrl).then(function(earthquakeResponse){

    var earthquakeLayer = createEarthquakesLayer(earthquakeResponse)

    d3.json(tectonicPlateUrl).then(function(tectonicResponse){

        var tectonicPlatesLayer = createTectonicPlatesLayer(tectonicResponse)

        createMap(earthquakeLayer, tectonicPlatesLayer)

    });

});



var mapCenter = [39.9283, -98.5795];
var mapZoom = 5;

function createMap(markerLayer, plateLayer) {

    // Create the tile layer that will be the background of our map.
    var streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });    

    var satelliteLayer = L.tileLayer.provider('MapBox', {
        id: 'mapbox/satellite-v9',
        accessToken: 'pk.eyJ1IjoiamFjb2J0cmV2aXRoaWNrMSIsImEiOiJja3c2eG45bjgzNGtoMnZwYXRnYjJzNGttIn0.3qRI1UQUwRpCWWo_uFk1Tw'
    });
    

    var myMap = L.map('map', {
        center: mapCenter,
        zoom: mapZoom,
        layers: [streetMapLayer, markerLayer, topoLayer, plateLayer, satelliteLayer]
    });

    var baseMap = {
        "Street Map": streetMapLayer,
        "Topographical Map": topoLayer,
        "Satellite Map": satelliteLayer
    };

    var earthquakeOverlayMap = {
        "Earthquakes": markerLayer,
        "Tectonic Plates": plateLayer
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

    return earthquakeLayerGroup;

};

function createTectonicPlatesLayer(response){
    
    var plates = response.features;

    var tectonicPlates = L.geoJSON(plates);

    return tectonicPlates;
};

function adjustMag(mag) {
    
    var inverseMag = Math.pow(10, mag)
    
    return Math.sqrt(inverseMag) * 300;
};

function getColor(d) {
    return d > 90 ? '#78281F' :
           d > 70  ? '#E74C3C' :
           d > 50  ? '#F39C12' :
           d > 30  ? '#F9E79F' :
           d > 10   ? '#82E0AA' :
                      '#1D8348';
};

