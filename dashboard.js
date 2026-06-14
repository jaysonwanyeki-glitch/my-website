/* =========================
   DASHBOARD LOGIC
   PIN gate, summary cards,
   tables, date filtering,
   and Excel export via SheetJS.
========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PIN GATE
  ========================= */
  const ADMIN_PIN = "1234";
  const gate = document.getElementById("pinGate");
  const content = document.getElementById("dashboardContent");
  const pinInput = document.getElementById("pinInput");
  const pinSubmit = document.getElementById("pinSubmit");
  const pinError = document.getElementById("pinError");

  if (sessionStorage.getItem("dashboardAuth") === "true") {
    gate.style.display = "none";
    content.style.display = "";
  }

  function attemptUnlock() {
    if (pinInput.value === ADMIN_PIN) {
      sessionStorage.setItem("dashboardAuth", "true");
      gate.style.display = "none";
      content.style.display = "";
      pinError.style.display = "none";
    } else {
      pinError.style.display = "block";
      pinInput.value = "";
      pinInput.focus();
    }
  }

  if (pinSubmit) {
    pinSubmit.addEventListener("click", attemptUnlock);
  }
  if (pinInput) {
    pinInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") attemptUnlock();
    });
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  /* ---- helpers ---- */
  function toDateStr(dateInput) {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function toMonthStr(dateInput) {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("default", { month: "long", year: "numeric" });
  }

  function todayStr() {
    return toDateStr(new Date());
  }

  function formatNum(n) {
    return n.toLocaleString("en-KE");
  }

  /* ---- summary cards ---- */
  function updateSummary() {
    const today = todayStr();
    const todayOrders = orders.filter((o) => toDateStr(o.date) === today);

    const totalRev = orders.reduce((s, o) => s + (o.price || 0), 0);
    const todayRev = todayOrders.reduce((s, o) => s + (o.price || 0), 0);

    document.getElementById("totalOrders").textContent = orders.length;
    document.getElementById("totalRevenue").textContent = `KSh ${formatNum(totalRev)}`;
    document.getElementById("todayOrders").textContent = todayOrders.length;
    document.getElementById("todayRevenue").textContent = `KSh ${formatNum(todayRev)}`;
  }

  /* ---- orders table ---- */
  function renderOrdersTable(filtered) {
    const list = filtered || orders;
    const tbody = document.getElementById("ordersTableBody");
    const noMsg = document.getElementById("noOrdersMsg");
    const table = document.getElementById("ordersTable");

    if (list.length === 0) {
      table.style.display = "none";
      noMsg.style.display = "block";
      return;
    }

    table.style.display = "";
    noMsg.style.display = "none";

    tbody.innerHTML = list
      .slice()
      .reverse()
      .map(
        (o) => `<tr>
        <td>${o.id}</td>
        <td>${o.date || "—"}</td>
        <td>${o.name || "—"}</td>
        <td>${o.pickup || "—"} → ${o.delivery || "—"}</td>
        <td>${o.service || "—"}</td>
        <td>${o.price || 0}</td>
        <td><span class="status-badge status-${(o.status || "pending").toLowerCase().replace(/\s+/g, "-")}">${o.status || "Pending"}</span></td>
      </tr>`
      )
      .join("");
  }

  /* ---- monthly summary table ---- */
  function renderMonthlyTable() {
    const months = {};
    orders.forEach((o) => {
      const key = toMonthStr(o.date) || "Unknown";
      if (!months[key]) months[key] = { orders: 0, revenue: 0, services: {} };
      months[key].orders++;
      months[key].revenue += o.price || 0;
      const svc = o.service || "Other";
      months[key].services[svc] = (months[key].services[svc] || 0) + 1;
    });

    const tbody = document.getElementById("monthlyTableBody");
    const entries = Object.entries(months);

    if (entries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No data yet</td></tr>';
      return;
    }

    tbody.innerHTML = entries
      .map(([month, data]) => {
        const avg = data.orders > 0 ? Math.round(data.revenue / data.orders) : 0;
        const topService = Object.entries(data.services).sort((a, b) => b[1] - a[1])[0];
        return `<tr>
          <td>${month}</td>
          <td>${data.orders}</td>
          <td>${formatNum(data.revenue)}</td>
          <td>${formatNum(avg)}</td>
          <td>${topService ? topService[0] : "—"}</td>
        </tr>`;
      })
      .join("");
  }

  /* ---- date filter ---- */
  const filterDate = document.getElementById("filterDate");
  const applyBtn = document.getElementById("applyFilter");
  const clearBtn = document.getElementById("clearFilter");
  const tableTitle = document.getElementById("tableTitle");

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const val = filterDate.value;
      if (!val) return;
      const filtered = orders.filter((o) => toDateStr(o.date) === val);
      renderOrdersTable(filtered);
      tableTitle.textContent = `Orders for ${new Date(val + "T00:00:00").toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      filterDate.value = "";
      renderOrdersTable();
      tableTitle.textContent = "All Orders";
    });
  }

  /* =========================
     EXCEL EXPORT (SheetJS)
  ========================= */
  function orderToRow(o) {
    return {
      "Tracking ID": o.id,
      "Date": o.date || "",
      "Customer Name": o.name || "",
      "Phone": o.phone || "",
      "Pickup Location": o.pickup || "",
      "Delivery Location": o.delivery || "",
      "Service Type": o.service || "",
      "Urgency": o.urgency || "",
      "Price (KSh)": o.price || 0,
      "Status": o.status || "Pending",
      "Notes": o.message || "",
    };
  }

  function downloadExcel(data, sheetName, fileName) {
    if (typeof XLSX === "undefined") {
      alert("Excel library not loaded. Please check your internet connection and refresh.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);

    /* auto-size columns */
    const colWidths = Object.keys(data[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...data.map((row) => String(row[key] || "").length)
      );
      return { wch: Math.min(maxLen + 2, 40) };
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  }

  /* Export: Today's deliveries */
  const exportDailyBtn = document.getElementById("exportDaily");
  if (exportDailyBtn) {
    exportDailyBtn.addEventListener("click", () => {
      const today = todayStr();
      const todayOrders = orders.filter((o) => toDateStr(o.date) === today);

      if (todayOrders.length === 0) {
        alert("No orders for today yet.");
        return;
      }

      const rows = todayOrders.map(orderToRow);
      const totalRev = todayOrders.reduce((s, o) => s + (o.price || 0), 0);
      rows.push({
        "Tracking ID": "",
        "Date": "",
        "Customer Name": "",
        "Phone": "",
        "Pickup Location": "",
        "Delivery Location": "",
        "Service Type": "TOTAL",
        "Urgency": "",
        "Price (KSh)": totalRev,
        "Status": `${todayOrders.length} orders`,
        "Notes": "",
      });

      const dateLabel = new Date().toLocaleDateString("en-KE").replace(/\//g, "-");
      downloadExcel(rows, "Daily Deliveries", `SwiftCourier_Daily_${dateLabel}.xlsx`);
    });
  }

  /* Export: Monthly summary */
  const exportMonthlyBtn = document.getElementById("exportMonthly");
  if (exportMonthlyBtn) {
    exportMonthlyBtn.addEventListener("click", () => {
      if (orders.length === 0) {
        alert("No orders to export.");
        return;
      }

      const wb = XLSX.utils.book_new();

      /* Sheet 1: Monthly summary */
      const months = {};
      orders.forEach((o) => {
        const key = toMonthStr(o.date) || "Unknown";
        if (!months[key]) months[key] = { orders: 0, revenue: 0, services: {} };
        months[key].orders++;
        months[key].revenue += o.price || 0;
        const svc = o.service || "Other";
        months[key].services[svc] = (months[key].services[svc] || 0) + 1;
      });

      const summaryRows = Object.entries(months).map(([month, data]) => {
        const avg = data.orders > 0 ? Math.round(data.revenue / data.orders) : 0;
        const topService = Object.entries(data.services).sort((a, b) => b[1] - a[1])[0];
        return {
          "Month": month,
          "Total Orders": data.orders,
          "Total Revenue (KSh)": data.revenue,
          "Avg Order Value (KSh)": avg,
          "Top Service": topService ? topService[0] : "—",
        };
      });

      const grandTotal = orders.reduce((s, o) => s + (o.price || 0), 0);
      summaryRows.push({
        "Month": "GRAND TOTAL",
        "Total Orders": orders.length,
        "Total Revenue (KSh)": grandTotal,
        "Avg Order Value (KSh)": orders.length > 0 ? Math.round(grandTotal / orders.length) : 0,
        "Top Service": "",
      });

      const ws1 = XLSX.utils.json_to_sheet(summaryRows);
      ws1["!cols"] = [{ wch: 20 }, { wch: 14 }, { wch: 20 }, { wch: 22 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws1, "Monthly Summary");

      /* Sheet 2: Daily breakdown */
      const days = {};
      orders.forEach((o) => {
        const key = toDateStr(o.date) || "Unknown";
        if (!days[key]) days[key] = { orders: 0, revenue: 0 };
        days[key].orders++;
        days[key].revenue += o.price || 0;
      });

      const dailyRows = Object.entries(days)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
          "Date": date,
          "Orders": data.orders,
          "Revenue (KSh)": data.revenue,
        }));

      const ws2 = XLSX.utils.json_to_sheet(dailyRows);
      ws2["!cols"] = [{ wch: 14 }, { wch: 10 }, { wch: 16 }];
      XLSX.utils.book_append_sheet(wb, ws2, "Daily Breakdown");

      /* Sheet 3: All orders detail */
      const detailRows = orders.map(orderToRow);
      const ws3 = XLSX.utils.json_to_sheet(detailRows);
      ws3["!cols"] = Object.keys(detailRows[0] || {}).map((key) => ({ wch: Math.min(key.length + 5, 30) }));
      XLSX.utils.book_append_sheet(wb, ws3, "All Orders");

      const monthLabel = new Date().toLocaleString("default", { month: "long", year: "numeric" }).replace(/\s+/g, "_");
      XLSX.writeFile(wb, `SwiftCourier_Monthly_${monthLabel}.xlsx`);
    });
  }

  /* Export: All orders */
  const exportAllBtn = document.getElementById("exportAll");
  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", () => {
      if (orders.length === 0) {
        alert("No orders to export.");
        return;
      }
      const rows = orders.map(orderToRow);
      downloadExcel(rows, "All Orders", "SwiftCourier_AllOrders.xlsx");
    });
  }

  /* ---- init ---- */
  updateSummary();
  renderOrdersTable();
  renderMonthlyTable();
});
