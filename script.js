/* ============================
   DARK MODE TOGGLE (BULB)
============================ */
const darkToggle = document.getElementById("darkModeToggle");

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Save preference
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* ============================
   ORDER FORM HANDLING
============================ */
const orderForm = document.getElementById("orderForm");

if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pickup = document.getElementById("pickup").value.trim();
    const delivery = document.getElementById("delivery").value.trim();
    const distance = document.getElementById("distance").value;
    const notes = document.getElementById("notes").value.trim();

    // Basic pricing logic
    let price = 0;
    if (distance <= 5) {
      price = 150;
    } else if (distance <= 10) {
      price = 300;
    } else {
      price = 500;
    }

    /* ============================
       SAVE ORDER FOR DASHBOARD
    ============================ */
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
      id: Date.now(),
      name: name,
      phone: phone,
      pickup: pickup,
      delivery: delivery,
      distance: distance,
      price: price,
      notes: notes,
      status: "Pending"
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    /* ============================
       SEND TO WHATSAPP
    ============================ */
    const message = `
🚚 *Swift Courier Order*

👤 Name: ${name}
📞 Phone: ${phone}
📍 Pickup: ${pickup}
📦 Delivery: ${delivery}
📏 Distance: ${distance} km
💰 Price: Ksh ${price}
📝 Notes: ${notes || "None"}
    `;

    const whatsappNumber = "254793676054";
    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

    // Reset form
    orderForm.reset();
    alert("Order sent successfully!");
  });
}

/* ============================
   DASHBOARD LOADER
============================ */
const ordersTable = document.getElementById("ordersTable");

if (ordersTable) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.name}</td>
      <td>${order.pickup}</td>
      <td>${order.delivery}</td>
      <td>Ksh ${order.price}</td>
      <td>${order.status}</td>
      <td>
        <button onclick="markCompleted(${order.id})">Complete</button>
      </td>
    `;

    ordersTable.appendChild(row);
  });
}

/* ============================
   UPDATE ORDER STATUS
============================ */
function markCompleted(id) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders = orders.map((order) => {
    if (order.id === id) {
      order.status = "Completed";
    }
    return order;
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  location.reload();
}
