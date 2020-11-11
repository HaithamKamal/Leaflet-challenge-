// urls that data comes from
month_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
console.log(month_url);

// map object
var myMap = L.map("map", {
  center: [39.164141, -99.006706], zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Define function of radius based on magnitude
function radiusSize(magnitude) 
{
return magnitude * 3;
}

function styleInfo(feature) 
{
return {
  opacity: 1,
  fillOpacity: 1,
  fillColor: chooseColor(feature.properties.mag),
  color: "#000000",
  radius: radiusSize(feature.properties.mag),
  stroke: true,
  weight: 0.5
};
}

// Color of circles
function chooseColor(magnitude) 
{
switch (true) 
{
case magnitude > 5:
  return "#ff6666";
case magnitude > 4:
  return "#ff8c66";
case magnitude > 3:
  return "#ffb366";
case magnitude > 2:
  return "#ffd966";
case magnitude > 1:
  return "#ffff66";
default:
  return "#fff0b3";
}
}

// Grabbing our GeoJSON data..
d3.json(month_url).then(function(data)
{
  console.log(data)
L.geoJson(data, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng) 
},
style: styleInfo, 

// Getting  feature
onEachFeature: function(feature, layer) 
{
// GeoJSON layer with the retrieved data
  layer.bindPopup("<h4> Location: " + feature.properties.place + "</h4> <hr> <h5> Magnitude: " + feature.properties.mag + "</h5>");
},
}).addTo(myMap);


//Legend
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Magnitude</h4>";
  div.innerHTML += '<i style="background: #ff6666"></i><span>5> Magnitude</span><br>';
  div.innerHTML += '<i style="background: #ff8c66"></i><span>4> Magnitude</span><br>';
  div.innerHTML += '<i style="background: #ffb366"></i><span>3> Magnitude</span><br>';
  div.innerHTML += '<i style="background: #ffd966"></i><span>2> Magnitude</span><br>';
  div.innerHTML += '<i style="background: #ffff66"></i><span>1> Magnitude</span><br>'; 

  return div;
};

legend.addTo(myMap);
});