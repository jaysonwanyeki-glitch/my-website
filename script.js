// ==============================
// Swift Courier - script.js
// ==============================

// Wait until the page loads
document.addEventListener("DOMContentLoaded", () => {

  // Select the form element
  const deliveryForm = document.getElementById("deliveryForm");

  if (!deliveryForm) return; // Stop if form doesn't exist

  // WhatsApp number
  const whatsappNumber = "254793676054"; // Replace with your number

  // Handle form submission
  deliveryForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop default form submission

    // Get form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pickup = document.getElementById("pickup").value.trim();
    const dropoff = document.getElementById("dropoff").value.trim();
    const note = document.getElementById("note").value.trim();

    // Simple validation
    if (!name || !phone || !pickup || !dropoff) {
      alert("Please fill in all required fields!");
      return;
    }

    // Build WhatsApp message
    const message = `Hello Swift Courier! 🚚
*New Delivery Request*
Name: ${name}
Phone: ${phone}
Pickup: ${pickup}
Dropoff: ${dropoff}
Note: ${note || "N/A"}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp link
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");

    // Optional: Reset form after sending
    deliveryForm.reset();
  });
});

