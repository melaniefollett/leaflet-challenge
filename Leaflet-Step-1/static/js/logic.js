// Store API endpoint as queryUrl
//Decided to look at all earthquakes measured per day
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  //Create new GeoJSON layer and add to map using feature array
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {
  console.log("Earthquake Data", earthquakeData);

  //Define onEachFeature handler
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr /><p>Time: ${feature.properties.time}<br />Magnitude: ${feature.properties.mag}</p>`);
  }

  //Function to link radius size to magnitude value of earthquake
  function radiusSize(magnitude) {
    return magnitude * 10000;
  }

  //Function to determine circle marker color based on magnitude value of earthquake
  function circleColor(magnitude) {
    if (magnitude < 1) {
      return "#ccff33"
    }
    else if (magnitude < 2) {
      return "#ffff33"
    }
    else if (magnitude < 3) {
      return "#ffcc33"
    }
    else if (magnitude < 4) {
      return "#ff9933"
    }
    else if (magnitude < 5) {
      return "#ff6633"
    }
    else {
      return "#ff3333"
    }
  };

  //Set up circle markers
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  //Create map using earthquake data
  createMap(earthquakes);
}

function createMap(earthquakes) {
  //Create map tile layer.  I used this approach so it would be easier to add additional map options for Part 2 of the assignment
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a base map layer (set up in anticipation of Part 2)
  var baseMaps = {
    "Default Map": lightmap,
  };

  // Create overlay map layer (set up in anticipation of Part 2)
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create map, giving it the layers to display
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Add layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //Add color function for legend
  function legendColor(magnitude) {
    if (magnitude < 1) {
      return "#ccff33"
    }
    else if (magnitude < 2) {
      return "#ffff33"
    }
    else if (magnitude < 3) {
      return "#ffcc33"
    }
    else if (magnitude < 4) {
      return "#ff9933"
    }
    else if (magnitude < 5) {
      return "#ff6633"
    }
    else {
      return "#ff3333"
    }
  };

  //Set up legend
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function (myMap) {
      let div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // Loop through magnitude levels and generate a label with a colored square for each
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + legendColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
      return div;
  };
  
  //Add legend to map
  legend.addTo(myMap);
};