let map, directionsService, directionsRenderer;

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");

  if (toggle) {
    if (localStorage.getItem("darkMode") === "on") {
      document.body.classList.add("dark-mode");
      toggle.textContent = "🌙";
    }

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const dark = document.body.classList.contains("dark-mode");
      toggle.textContent = dark ? "🌙" : "💡";
      localStorage.setItem("darkMode", dark ? "on" : "off");
    });
  }
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -1.286389, lng: 36.817223 }, // Nairobi
    zoom: 12,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const pickup = new google.maps.places.Autocomplete(
    document.getElementById("pickup")
  );
  const delivery = new google.maps.places.Autocomplete(
    document.getElementById("delivery")
  );

  pickup.addListener("place_changed", calculateRoute);
  delivery.addListener("place_changed", calculateRoute);
}

function calculateRoute() {
  const pickup = document.getElementById("pickup").value;
  const delivery = document.getElementById("delivery").value;

  if (!pickup || !delivery) return;

  directionsService.route(
    {
      origin: pickup,
      destination: delivery,
      travelMode: "DRIVING",
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const distanceMeters =
          result.routes[0].legs[0].distance.value;
        const distanceKm = (distanceMeters / 1000).toFixed(1);

        document.getElementById("distance").textContent =
          distanceKm + " km";

        let price = 150;
        if (distanceKm > 3 && distanceKm <= 10) price = 350;
        if (distanceKm > 10) price = 500;

        document.getElementById("price").textContent =
          "Ksh " + price;

        document
          .getElementById("orderForm")
          .setAttribute("data-price", price);
        document
          .getElementById("orderForm")
          .setAttribute("data-distance", distanceKm);
      }
    }
  );
}

// SEND TO WHATSAPP
document.addEventListener("submit", (e) => {
  if (e.target.id !== "orderForm") return;
  e.preventDefault();

  const name = e.target.name.value;
  const phone = e.target.phone.value;
  const pickup = document.getElementById("pickup").value;
  const delivery = document.getElementById("delivery").value;
  const distance = e.target.getAttribute("data-distance");
  const price = e.target.getAttribute("data-price");
  const notes = document.getElementById("notes").value;

  const message = `
📦 NEW DELIVERY ORDER
👤 Name: ${name}
📞 Phone: ${phone}
📍 Pickup: ${pickup}
🏁 Delivery: ${delivery}
📏 Distance: ${distance} km
💰 Price: Ksh ${price}
📝 Notes: ${notes}
`;

  window.open(
    `https://wa.me/254793676054?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});
