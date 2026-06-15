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
