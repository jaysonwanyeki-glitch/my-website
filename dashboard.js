const table = document.getElementById("ordersTable");
const orders = JSON.parse(localStorage.getItem("orders")) || [];

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

function assignRider(id) {
  const rider = prompt("Enter Rider Phone (2547XXXXXXXX):");
  if (!rider) return;

  const order = orders.find(o => o.id === id);

  const message = `
🚴 NEW DELIVERY JOB
👤 Customer: ${order.name}
📞 ${order.phone}
📍 Pickup: ${order.pickup}
🏁 Delivery: ${order.delivery}
💰 Pay: Ksh ${order.price}
`;

  window.open(
    `https://wa.me/${rider}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  order.status = "Assigned";
  localStorage.setItem("orders", JSON.stringify(orders));
}
