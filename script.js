// ==============================
// Swift Courier - script.js
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  // Dark mode toggle
  const toggleBtn = document.getElementById('darkModeToggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  // Delivery form WhatsApp
  const deliveryForm = document.getElementById("deliveryForm");
  if (!deliveryForm) return;

  const whatsappNumber = "254793676054"; // Your WhatsApp

  deliveryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pickup = document.getElementById("pickup").value.trim();
    const dropoff = document.getElementById("dropoff").value.trim();
    const note = document.getElementById("note").value.trim();

    if (!name || !phone || !pickup || !dropoff) {
      alert("Please fill in all required fields!");
      return;
    }

    const message = `Hello Swift Courier! 🚚
*New Delivery Request*
Name: ${name}
Phone: ${phone}
Pickup: ${pickup}
Dropoff: ${dropoff}
Note: ${note || "N/A"}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");

    deliveryForm.reset();
  });
});
