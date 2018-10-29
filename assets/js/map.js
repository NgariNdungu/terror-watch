---
---
"use strict"

var kenyaExtents = L.latLngBounds([[-4.124, 34.266],[3.229, 40.711]]);
var map = L.map('map').fitBounds(kenyaExtents);
map.setZoom(7);

// base map options
var tileOptions = {
    minZoom: 6,
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors </br>",
    noWrap: true
    };
// url template {s} or one of subdomain
var osmBase = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tileOptions).addTo(map);

// set up attacks GeoJSON
var attacksJson = JSON.parse('{{ site.data.attacks | jsonify }}')

var geoJsonOptions = {
  filter: function (feature) {
    // return true if attack-id matched in attacks collection
    return true
  },
  onEachFeature: function (feature, layer) {
    // attach pop-up to each feature
    {% for attack in site.attacks %}
    var attack = '{{ attack.attack-id }}'
    if (attack == feature.properties.attack_id) { 
    // create pop-up content and attach to layer
        var popupContent = `<h3>{{ attack.title }}</h3>
          <p>Date: {{ attack.date | date: "%b %d, %y" }}
          <p>Deaths: {{ attack.deaths }} </p>
          <p>Injuries: {{ attack.injuries }} </p>
          <p>Details: <a href="{{ attack.url }}">{{ attack.url }}</a>`
      
      layer.bindPopup(popupContent)
      layer.on('click', function(e) {layer.openPopup()})
    }
    {% endfor %}
  }
}

L.geoJSON(attacksJson, geoJsonOptions).addTo(map)
