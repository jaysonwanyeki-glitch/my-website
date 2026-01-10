// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Initialize Google Map with Autocomplete
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -1.286389, lng: 36.817223 }, // Nairobi center
    zoom: 12
  });

  const pickupInput = document.getElementById("pickup");
  const deliveryInput = document.getElementById("delivery");
  const pickupLatLng = document.getElementById("pickupLatLng");
  const deliveryLatLng = document.getElementById("deliveryLatLng");

  const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput);
  const deliveryAutocomplete = new google.maps.places.Autocomplete(deliveryInput);

  pickupAutocomplete.addListener("place_changed", () => {
    const place = pickupAutocomplete.getPlace();
    if (place.geometry) {
      pickupLatLng.value = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
      map.panTo(place.geometry.location);
      map.setZoom(14);
    }
  });

  deliveryAutocomplete.addListener("place_changed", () => {
    const place = deliveryAutocomplete.getPlace();
    if (place.geometry) {
      deliveryLatLng.value = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
      map.panTo(place.geometry.location);
      map.setZoom(14);
    }
  });
}

// Submit Form to WhatsApp with pinned locations
const orderForm = document.getElementById("orderForm");
orderForm?.addEventListener("submit", e => {
  e.preventDefault();
  const name = orderForm.name.value;
  const phone = orderForm.phone.value;
  const pickup = orderForm.pickup.value;
  const delivery = orderForm.delivery.value;
  const pickupCoords = orderForm.pickupLatLng.value || 'Not pinned';
  const deliveryCoords = orderForm.deliveryLatLng.value || 'Not pinned';
  const message = orderForm.message.value;

  const whatsappMsg = `📦 New Order!
Name: ${name}
Phone: ${phone}
Pickup: ${pickup} (${pickupCoords})
Delivery: ${delivery} (${deliveryCoords})
Details: ${message}`;

  window.open(`https://wa.me/254793676054?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
});
