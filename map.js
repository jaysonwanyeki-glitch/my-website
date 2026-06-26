/* =========================
   KENYA SERVICE MAP
   Leaflet + OpenStreetMap
========================= */

(function() {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', initMap);

  var map;
  var markers = [];
  var routeLines = [];

  function initMap() {
    var mapContainer = document.getElementById('kenyaMap');
    if (!mapContainer) return;

    // Initialize map centered on Nairobi
    map = L.map('kenyaMap').setView([-1.2921, 36.8219], 12);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 5
    }).addTo(map);

    // Zone data with coordinates
    var zones = [
      { id: 'cbd', name: 'Nairobi CBD', coords: [-1.2863, 36.8172], radius: 2000, color: '#0b5ed7', time: '90 min', price: 'KSh 150-250' },
      { id: 'westlands', name: 'Westlands', coords: [-1.2676, 36.8062], radius: 2500, color: '#10b981', time: '90 min', price: 'KSh 200-300' },
      { id: 'kilimani', name: 'Kilimani & Hurlingham', coords: [-1.2921, 36.7900], radius: 2200, color: '#f59e0b', time: '90 min', price: 'KSh 200-300' },
      { id: 'eastleigh', name: 'Eastleigh & Pangani', coords: [-1.2715, 36.8450], radius: 2000, color: '#ef4444', time: '90 min', price: 'KSh 200-300' },
      { id: 'thika', name: 'Thika Road Corridor', coords: [-1.2150, 36.8800], radius: 5000, color: '#8b5cf6', time: '2 hours', price: 'KSh 300-500' },
      { id: 'mombasa', name: 'Mombasa Road', coords: [-1.3230, 36.8500], radius: 6000, color: '#06b6d4', time: '2 hours', price: 'KSh 300-500' },
      { id: 'karen', name: 'Karen & Ngong', coords: [-1.3200, 36.7100], radius: 4500, color: '#ec4899', time: '2 hours', price: 'KSh 350-550' },
      { id: 'outskirts', name: 'Greater Nairobi Area', coords: [-1.3500, 36.9000], radius: 8000, color: '#6b7280', time: 'Same day', price: 'KSh 400-800' }
    ];

    // Major roads/routes as polylines
    var routes = [
      { name: 'Mombasa Road (A104)', coords: [[-1.2863, 36.8172], [-1.3000, 36.8250], [-1.3200, 36.8350], [-1.3500, 36.8500]], color: '#0b5ed7' },
      { name: 'Thika Road (A2)', coords: [[-1.2863, 36.8172], [-1.2600, 36.8300], [-1.2200, 36.8600], [-1.1800, 36.9000]], color: '#10b981' },
      { name: 'Ngong Road (B36)', coords: [[-1.2863, 36.8172], [-1.2950, 36.7900], [-1.3100, 36.7500], [-1.3200, 36.7100]], color: '#f59e0b' },
      { name: 'Waiyaki Way (A104)', coords: [[-1.2863, 36.8172], [-1.2800, 36.8000], [-1.2700, 36.7800], [-1.2600, 36.7600]], color: '#ef4444' },
      { name: 'Jogoo Road (C98)', coords: [[-1.2863, 36.8172], [-1.2800, 36.8500], [-1.2700, 36.8700], [-1.2600, 36.8900]], color: '#8b5cf6' },
      { name: 'Eastern Bypass', coords: [[-1.2200, 36.8600], [-1.2400, 36.8800], [-1.2800, 36.9000], [-1.3200, 36.9100]], color: '#06b6d4' }
    ];

    // Draw zone circles and markers
    zones.forEach(function(zone) {
      var circle = L.circle(zone.coords, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.15,
        weight: 2,
        radius: zone.radius
      }).addTo(map);

      var marker = L.marker(zone.coords, {
        icon: L.divIcon({
          className: 'map-zone-marker',
          html: '<div style="background:' + zone.color + ';width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        })
      }).addTo(map);

      var popupContent =
        '<div style="font-family:Arial,sans-serif;min-width:200px;">' +
          '<h4 style="margin:0 0 8px;color:' + zone.color + ';font-size:15px;">' + zone.name + '</h4>' +
          '<p style="margin:4px 0;font-size:13px;"><strong>Est. Time:</strong> ' + zone.time + '</p>' +
          '<p style="margin:4px 0;font-size:13px;"><strong>Price:</strong> ' + zone.price + '</p>' +
          '<a href="contact.html?zone=' + zone.id + '" style="display:inline-block;margin-top:10px;padding:6px 14px;background:' + zone.color + ';color:#fff;text-decoration:none;border-radius:4px;font-size:13px;">Order from here →</a>' +
        '</div>';

      marker.bindPopup(popupContent);
      circle.bindPopup(popupContent);

      markers.push({ marker: marker, circle: circle, zone: zone });
    });

    // Draw route lines
    routes.forEach(function(route) {
      var polyline = L.polyline(route.coords, {
        color: route.color,
        weight: 3,
        opacity: 0.7,
        dashArray: '8, 6'
      }).addTo(map);

      polyline.bindPopup('<strong>' + route.name + '</strong><br>Major delivery route');
      routeLines.push({ line: polyline, route: route });
    });

    // Filter buttons
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = this.dataset.filter;

        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        if (filter === 'all') {
          markers.forEach(function(m) {
            m.marker.addTo(map);
            m.circle.addTo(map);
          });
          routeLines.forEach(function(r) { r.line.addTo(map); });
          map.setView([-1.2921, 36.8219], 12);
        } else {
          markers.forEach(function(m) {
            if (m.zone.id === filter) {
              m.marker.addTo(map);
              m.circle.addTo(map);
              map.setView(m.zone.coords, 13);
            } else {
              map.removeLayer(m.marker);
              map.removeLayer(m.circle);
            }
          });
        }
      });
    });

    // Zone list items
    var zoneItems = document.querySelectorAll('.zone-item');
    zoneItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var zoneId = this.dataset.zone;
        var zone = zones.find(function(z) { return z.id === zoneId; });
        if (zone) {
          map.setView(zone.coords, 14);
          markers.forEach(function(m) {
            if (m.zone.id === zoneId) {
              m.marker.openPopup();
            }
          });
        }
      });
    });

    // Search functionality
    var searchInput = document.getElementById('mapSearchInput');
    var searchBtn = document.getElementById('mapSearchBtn');

    function performSearch() {
      var query = searchInput.value.toLowerCase().trim();
      if (!query) return;

      var matched = zones.find(function(z) {
        return z.name.toLowerCase().includes(query) || z.id === query;
      });

      if (matched) {
        map.setView(matched.coords, 14);
        markers.forEach(function(m) {
          if (m.zone.id === matched.id) {
            m.marker.openPopup();
          }
        });
      } else {
        var locations = {
          'cbd': [-1.2863, 36.8172], 'westlands': [-1.2676, 36.8062],
          'kilimani': [-1.2921, 36.7900], 'karen': [-1.3200, 36.7100],
          'eastleigh': [-1.2715, 36.8450], 'thika': [-1.2150, 36.8800],
          'ngong': [-1.3500, 36.6500], 'machakos': [-1.5177, 37.2634],
          'kiambu': [-1.1713, 36.8357], 'mombasa': [-4.0435, 39.6682],
          'nakuru': [-0.3031, 36.0800]
        };

        for (var key in locations) {
          if (query.includes(key)) {
            map.setView(locations[key], 13);
            return;
          }
        }

        alert('Location not found. Try: CBD, Westlands, Kilimani, Karen, Eastleigh, Thika, Ngong, etc.');
      }
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
      });
    }
  }
})();
