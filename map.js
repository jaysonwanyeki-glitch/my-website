/* =========================
   NAIROBI DELIVERY ROUTES MAP
   Leaflet.js + OpenStreetMap
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("nairobi-map");
  if (!mapEl) return;

  const map = L.map("nairobi-map").setView([-1.2864, 36.8172], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  const routes = [
    {
      name: "CBD — Westlands",
      color: "#0b5ed7",
      coords: [
        [-1.2864, 36.8172],
        [-1.2800, 36.8100],
        [-1.2710, 36.8050],
        [-1.2680, 36.8020],
        [-1.2635, 36.8042],
      ],
    },
    {
      name: "CBD — South B/C",
      color: "#e74c3c",
      coords: [
        [-1.2864, 36.8172],
        [-1.2920, 36.8200],
        [-1.2990, 36.8260],
        [-1.3050, 36.8300],
        [-1.3100, 36.8340],
      ],
    },
    {
      name: "Westlands — Kilimani",
      color: "#27ae60",
      coords: [
        [-1.2635, 36.8042],
        [-1.2680, 36.7980],
        [-1.2730, 36.7900],
        [-1.2870, 36.7850],
        [-1.2920, 36.7830],
      ],
    },
    {
      name: "CBD — Eastlands",
      color: "#f39c12",
      coords: [
        [-1.2864, 36.8172],
        [-1.2850, 36.8300],
        [-1.2830, 36.8400],
        [-1.2810, 36.8500],
        [-1.2780, 36.8600],
      ],
    },
    {
      name: "Kilimani — Karen",
      color: "#9b59b6",
      coords: [
        [-1.2920, 36.7830],
        [-1.2980, 36.7750],
        [-1.3050, 36.7650],
        [-1.3150, 36.7550],
        [-1.3200, 36.7400],
      ],
    },
  ];

  routes.forEach((route) => {
    L.polyline(route.coords, {
      color: route.color,
      weight: 4,
      opacity: 0.8,
    })
      .addTo(map)
      .bindPopup(`<strong>${route.name}</strong>`);
  });

  const hubs = [
    { name: "CBD Hub", coords: [-1.2864, 36.8172] },
    { name: "Westlands Hub", coords: [-1.2635, 36.8042] },
    { name: "Kilimani Hub", coords: [-1.2920, 36.7830] },
    { name: "South B/C", coords: [-1.3100, 36.8340] },
    { name: "Eastlands", coords: [-1.2780, 36.8600] },
    { name: "Karen", coords: [-1.3200, 36.7400] },
  ];

  hubs.forEach((hub) => {
    L.marker(hub.coords)
      .addTo(map)
      .bindPopup(`<strong>${hub.name}</strong><br>Swift Courier pickup/delivery point`);
  });
});
