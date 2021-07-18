var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});


var map = L.map("mapid", {
    center: [40.73, -94.0],
    zoom: 6,
  });
  
  // Add our 'lightmap' tile layer to the map
  lightmap.addTo(map);
  var earthquakelayer = new L.LayerGroup()
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
     function stylefunc(feature){
         return {
             opacity: .75, 
             fillOpacity: .75,
             fillColor: makecolor(feature.geometry.coordinates[2]),
             color: "white", 
             stroke: true,
             weight: 1.5, 
             radius: makeradius(feature.properties.mag)
         }
     }
     function makecolor(depth){
         if (depth > 90){
             return "red"
         } else if (depth > 70){
             return "orange"
         }else if(depth > 50){
             return "yellow"
         }
         else{
             return "green"
         }
     }
     function makeradius(mag){
         if (mag == 0){
             return 1
         } else {
             return mag * 6
         }
     }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng)
        },
        style: stylefunc, 
        onEachFeature: function(feature, layer){
            layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>location: ${feature.properties.place}`)
        }
    }).addTo(earthquakelayer)
    earthquakelayer.addTo(map)
  })