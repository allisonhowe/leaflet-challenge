var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 2
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

d3.json(url, function(response) {

  console.log(response);

  for (var i = 0; i < response.features.length; i++) {
    var coordinates = response.features[i].geometry.coordinates;
    var magnitude = response.features[i].properties.mag;
    var location = response.features[i].properties.place;
    var time = new Date(response.features[i].properties.time).toLocaleString();

    var color = "#ff5f65";
    if (coordinates[2] >= -10 && coordinates[2] <= 10) {
      color = "green";
    } else if (coordinates[2] >= 11 && coordinates[2] <= 30) {
      color = "#dde036";
    } else if (coordinates[2] >= 31 && coordinates[2] <= 50) {
      color = "#f7db3e";
    } else if (coordinates[2] >= 51 && coordinates[2] <= 70) {
      color = "#ffb739";
    } else if (coordinates[2] >= 71 && coordinates[2] <= 90) {
      color = "#fda362";
    }

    L.circle([coordinates[1], coordinates[0]], {
      color: color,
      fillColor: color,
      fillOpacity: 1,
      radius: magnitude * 20000,
    }).addTo(myMap).bindPopup(`magnitude: ${magnitude}<br>location: ${location}<br>time: ${time}`);
  }

  var legend = L.control({
    position : 'bottomright'
  });
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend');
    colors = [
      '<div style="display: flex"><div class="square" style="background:green"></div><span>-10 - 10</span></div>',
      '<div style="display: flex"><div class="square" style="background:#dde036"></div><span>10 - 30</span></div>',
      '<div style="display: flex"><div class="square" style="background:#f7db3e"></div><span>30 - 50</span></div>',
      '<div style="display: flex"><div class="square" style="background:#ffb739"></div><span>50 - 70</span></div>',
      '<div style="display: flex"><div class="square" style="background:#fda362"></div><span>70 - 90</span></div>',
      '<div style="display: flex"><div class="square" style="background:#ff5f65"></div><span>90+</span></div>',
    ],

    div.innerHTML = colors.join('');
    return div;
  };
  legend.addTo(myMap);
});
