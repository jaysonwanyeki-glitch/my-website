// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Location Ping
const getLocationBtn = document.getElementById("getLocationBtn");
const locationInput = document.getElementById("location");

getLocationBtn?.addEventListener("click", () => {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        locationInput.value = `https://www.google.com/maps?q=${lat},${lng}`;
        alert("Location captured!");
      },
      error => alert("Unable to get location. Enter manually.")
    );
  } else alert("Geolocation not supported.");
});

// Submit Form to WhatsApp
const orderForm = document.getElementById("orderForm");
orderForm?.addEventListener("submit", e => {
  e.preventDefault();
  const name = orderForm.name.value;
  const phone = orderForm.phone.value;
  const pickup = orderForm.pickup.value;
  const delivery = orderForm.delivery.value;
  const location = orderForm.location?.value || '';
  const message = orderForm.message.value;

  const whatsappMsg = `📦 New Order!
Name: ${name}
Phone: ${phone}
Pickup: ${pickup}
Delivery: ${delivery}
Location: ${location}
Details: ${message}`;

  window.open(`https://wa.me/254793676054?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
});
