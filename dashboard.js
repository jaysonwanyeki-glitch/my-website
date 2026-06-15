/* =========================
   DASHBOARD AUTH GATE
(function () {
  var key = sessionStorage.getItem("dashAuth");
  if (key !== "granted") {
    var pass = prompt("Enter dispatcher password:");
    if (pass !== "SwiftDispatch2026") {
      document.body.innerHTML = "<p style='padding:40px;text-align:center'>Access denied.</p>";
      return;
    }
    sessionStorage.setItem("dashAuth", "granted");
  }

  /* =========================
     RENDER ORDERS (XSS-SAFE)
  ========================= */
  var table = document.getElementById("ordersTable");
  var orders = JSON.parse(localStorage.getItem("orders") || "[]");

  table.textContent = "";

  orders.forEach(function (order) {
    var row = document.createElement("tr");

    var tdName = document.createElement("td");
    tdName.textContent = order.name || "";
    row.appendChild(tdName);

    var tdPickup = document.createElement("td");
    tdPickup.textContent = order.pickup || "";
    row.appendChild(tdPickup);

    var tdDelivery = document.createElement("td");
    tdDelivery.textContent = order.delivery || "";
    row.appendChild(tdDelivery);

    var tdPrice = document.createElement("td");
    tdPrice.textContent = "Ksh " + (order.price || "0");
    row.appendChild(tdPrice);

    var tdAction = document.createElement("td");
    var btn = document.createElement("button");
    btn.textContent = "Assign";
    btn.addEventListener("click", function () {
      assignRider(order.id);
    });
    tdAction.appendChild(btn);
    row.appendChild(tdAction);

    table.appendChild(row);
  });

  /* =========================
     ASSIGN RIDER
  ========================= */
  function assignRider(id) {
    var rider = prompt("Enter Rider Phone (2547XXXXXXXX):");
    if (!rider || !/^2547\d{8}$/.test(rider)) {
      alert("Invalid phone number. Use format 2547XXXXXXXX.");
      return;
    }

    var order = orders.find(function (o) { return o.id === id; });
    if (!order) return;

    var message =
      "\uD83D\uDEB4 NEW DELIVERY JOB\n" +
      "\uD83D\uDC64 Customer: " + (order.name || "") + "\n" +
      "\uD83D\uDCDE " + (order.phone || "") + "\n" +
      "\uD83D\uDCCD Pickup: " + (order.pickup || "") + "\n" +
      "\uD83C\uDFC1 Delivery: " + (order.delivery || "") + "\n" +
      "\uD83D\uDCB0 Pay: Ksh " + (order.price || "0");

    window.open(
      "https://wa.me/" + encodeURIComponent(rider) + "?text=" + encodeURIComponent(message),
      "_blank"
    );

    order.status = "Assigned";
    localStorage.setItem("orders", JSON.stringify(orders));
  }
})();
let orders = [];

try {
  orders = JSON.parse(localStorage.getItem("orders")) || [];
} catch (e) {
  console.error("Failed to load orders from localStorage:", e);
  orders = [];
}

const table = document.getElementById("ordersTable");

if (!table) {
  console.error("Could not find #ordersTable element");
} else {
  table.innerHTML = "";

  orders.forEach(order => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.name}</td>
      <td>${order.pickup}</td>
      <td>${order.delivery}</td>
      <td>Ksh ${order.price}</td>
      <td>
        <button onclick="assignRider(${order.id})">Assign</button>
      </td>
    `;

    table.appendChild(row);
  });
}

function assignRider(id) {
  const rider = prompt("Enter Rider Phone (2547XXXXXXXX):");
  if (!rider) return;

  const order = orders.find(o => o.id === id);

  if (!order) {
    alert("Order not found. It may have been removed.");
    return;
  }

  const message = `
🚴 NEW DELIVERY JOB
👤 Customer: ${order.name}
📞 ${order.phone}
📍 Pickup: ${order.pickup}
🏁 Delivery: ${order.delivery}
💰 Pay: Ksh ${order.price}
`;

  const win = window.open(
    `https://wa.me/${rider}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  if (!win) {
    alert("Pop-up blocked. Please allow pop-ups to send the WhatsApp message.");
    return;
  }

  order.status = "Assigned";

  try {
    localStorage.setItem("orders", JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders to localStorage:", e);
    alert("Could not save the updated order. Storage may be full.");
  }
}
