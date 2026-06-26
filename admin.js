/* =========================
   SWIFT COURIER ADMIN DASHBOARD
   Comprehensive business management
========================= */

(function() {
  'use strict';

  // =========================
  // AUTH & INITIALIZATION
  // =========================
  var AUTH_KEY = 'swiftAdminAuth';
  var AUTH_PASSWORD_KEY = 'swiftAdminPassword';
  var DEFAULT_PASSWORD = 'admin2026';

  // Check auth on load
  checkAuth();

  function checkAuth() {
    var isAuth = sessionStorage.getItem(AUTH_KEY) === 'granted';
    var overlay = document.getElementById('adminAuthOverlay');

    if (!isAuth && overlay) {
      overlay.style.display = 'flex';
      setupAuthHandlers();
    } else if (overlay) {
      overlay.style.display = 'none';
      initDashboard();
    }
  }

  function setupAuthHandlers() {
    var loginBtn = document.getElementById('adminLoginBtn');
    var passwordInput = document.getElementById('adminPassword');

    if (loginBtn) {
      loginBtn.addEventListener('click', doLogin);
    }

    if (passwordInput) {
      passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') doLogin();
      });
    }
  }

  function doLogin() {
    var passwordInput = document.getElementById('adminPassword');
    var savedPassword = localStorage.getItem(AUTH_PASSWORD_KEY) || DEFAULT_PASSWORD;

    if (passwordInput && passwordInput.value === savedPassword) {
      sessionStorage.setItem(AUTH_KEY, 'granted');
      document.getElementById('adminAuthOverlay').style.display = 'none';
      initDashboard();
    } else {
      alert('Incorrect password. Try again.');
      if (passwordInput) passwordInput.value = '';
    }
  }

  // Logout
  var logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      sessionStorage.removeItem(AUTH_KEY);
      window.location.reload();
    });
  }

  // =========================
  // DEMO DATA GENERATOR
  // =========================
  function generateDemoData() {
    var existing = localStorage.getItem('orders');
    if (existing && JSON.parse(existing).length > 5) return;

    var names = ['ABC Ltd', 'Tech Solutions', 'Prime Holdings', 'Safari Logistics', 'Nairobi Legal',
                 'MediCare Pharmacy', 'Green Grocer', 'BluePrint Architects', 'Swift Finance', 'Royal Suites',
                 'Pinnacle Insurance', 'Metro Contractors', 'Vertex Technologies', 'Capital Partners', 'Omega Retail'];
    var pickups = ['CBD', 'Westlands', 'Kilimani', 'Eastleigh', 'Karen', 'Thika Road', 'Mombasa Road', 'Ngong Road'];
    var deliveries = ['Westlands', 'CBD', 'Karen', 'Kilimani', 'Eastleigh', 'Mombasa Road', 'Thika Road', 'Waiyaki Way'];
    var types = ['document', 'sensitive', 'parcel', 'business', 'express'];
    var statuses = ['Pending', 'Assigned', 'In Transit', 'Completed', 'Completed', 'Completed'];
    var riders = ['James O.', 'Peter K.', 'Mary W.', 'John M.', 'Alice N.', ''];
    var securities = ['Standard', 'High', 'Maximum', 'Standard', 'High'];

    var demoOrders = [];
    var now = Date.now();

    for (var i = 0; i < 35; i++) {
      var daysAgo = Math.floor(Math.random() * 7);
      var hoursAgo = Math.floor(Math.random() * 12);
      var timestamp = now - (daysAgo * 86400000) - (hoursAgo * 3600000);

      demoOrders.push({
        id: timestamp + Math.floor(Math.random() * 1000),
        name: names[Math.floor(Math.random() * names.length)],
        phone: '07' + (Math.floor(Math.random() * 90000000) + 10000000),
        pickup: pickups[Math.floor(Math.random() * pickups.length)],
        delivery: deliveries[Math.floor(Math.random() * deliveries.length)],
        type: types[Math.floor(Math.random() * types.length)],
        security: securities[Math.floor(Math.random() * securities.length)],
        price: Math.floor(Math.random() * 600) + 150,
        status: i < 5 ? statuses[Math.floor(Math.random() * 3)] : 'Completed',
        rider: riders[Math.floor(Math.random() * riders.length)],
        timestamp: timestamp,
        rating: Math.floor(Math.random() * 2) + 4
      });
    }

    demoOrders.sort(function(a, b) { return b.timestamp - a.timestamp; });
    localStorage.setItem('orders', JSON.stringify(demoOrders));

    // Generate riders
    var demoRiders = [
      { name: 'James Ochieng', phone: '254712345671', status: 'active', deliveries: 156, rating: 4.8, zone: 'CBD', earnings: 45200 },
      { name: 'Peter Kamau', phone: '254712345672', status: 'active', deliveries: 134, rating: 4.7, zone: 'Westlands', earnings: 38900 },
      { name: 'Mary Wanjiku', phone: '254712345673', status: 'active', deliveries: 189, rating: 4.9, zone: 'Kilimani', earnings: 52100 },
      { name: 'John Mwangi', phone: '254712345674', status: 'offduty', deliveries: 98, rating: 4.5, zone: 'Thika Road', earnings: 28400 },
      { name: 'Alice Njeri', phone: '254712345675', status: 'active', deliveries: 167, rating: 4.8, zone: 'Mombasa Road', earnings: 47800 }
    ];
    localStorage.setItem('riders', JSON.stringify(demoRiders));
  }

  // =========================
  // MAIN DASHBOARD INIT
  // =========================
  var charts = {};

  function initDashboard() {
    generateDemoData();
    setupNavigation();
    setupSidebar();
    updateDateDisplay();
    loadOverview();
    loadOrdersSection();
    loadAnalytics();
    loadRiders();
    loadZonePerformance();
    loadInsights();
    loadSettings();

    // Refresh button
    var refreshBtn = document.getElementById('refreshDataBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function() {
        this.textContent = '⏳ Loading...';
        setTimeout(function() {
          loadOverview();
          loadOrdersSection();
          loadAnalytics();
          loadInsights();
          refreshBtn.textContent = '🔄 Refresh';
        }, 500);
      });
    }

    // Export button
    var exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportData);
    }
  }

  function updateDateDisplay() {
    var dateEl = document.getElementById('currentDate');
    if (dateEl) {
      var now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-KE', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      });
    }
  }

  // =========================
  // NAVIGATION
  // =========================
  function setupNavigation() {
    var sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    var sections = document.querySelectorAll('.admin-section');
    var pageTitle = document.getElementById('pageTitle');

    sidebarLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var sectionId = this.dataset.section;

        sidebarLinks.forEach(function(l) { l.classList.remove('active'); });
        this.classList.add('active');

        sections.forEach(function(s) { s.classList.remove('active'); });
        var target = document.getElementById(sectionId);
        if (target) target.classList.add('active');

        if (pageTitle) {
          pageTitle.textContent = this.textContent.trim();
        }
      });
    });
  }

  function setupSidebar() {
    var toggle = document.getElementById('sidebarToggle');
    var sidebar = document.getElementById('adminSidebar');

    if (toggle && sidebar) {
      toggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
      });
    }
  }

  // =========================
  // DATA HELPERS
  // =========================
  function getOrders() {
    try {
      return JSON.parse(localStorage.getItem('orders')) || [];
    } catch (e) {
      return [];
    }
  }

  function getRiders() {
    try {
      return JSON.parse(localStorage.getItem('riders')) || [];
    } catch (e) {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  function getTodayStart() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }

  function getDaysAgo(days) {
    return Date.now() - (days * 86400000);
  }

  function formatCurrency(amount) {
    return 'KSh ' + amount.toLocaleString('en-KE');
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString('en-KE', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function getStatusBadge(status) {
    var colors = {
      'Pending': '#f59e0b',
      'Assigned': '#3b82f6',
      'In Transit': '#8b5cf6',
      'Completed': '#10b981',
      'Cancelled': '#ef4444'
    };
    var color = colors[status] || '#6b7280';
    return '<span style="background:' + color + '20;color:' + color + ';padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">' + status + '</span>';
  }

  function getTypeLabel(type) {
    var labels = {
      'document': '📄 Document',
      'sensitive': '🔒 Sensitive',
      'parcel': '📦 Parcel',
      'business': '🏢 Business',
      'express': '⚡ Express',
      'multistop': '📍 Multi-Stop'
    };
    return labels[type] || type;
  }

  // =========================
  // OVERVIEW SECTION
  // =========================
  function loadOverview() {
    var orders = getOrders();
    var riders = getRiders();
    var todayStart = getTodayStart();

    var todayOrders = orders.filter(function(o) { return o.timestamp >= todayStart; });
    var todayRevenue = todayOrders.reduce(function(sum, o) { return sum + (o.price || 0); }, 0);
    var todayCompleted = todayOrders.filter(function(o) { return o.status === 'Completed'; }).length;
    var pendingOrders = orders.filter(function(o) { return o.status === 'Pending' || o.status === 'Assigned'; }).length;
    var activeRiders = riders.filter(function(r) { return r.status === 'active'; }).length;

    var yesterdayStart = todayStart - 86400000;
    var yesterdayOrders = orders.filter(function(o) { return o.timestamp >= yesterdayStart && o.timestamp < todayStart; });
    var yesterdayRevenue = yesterdayOrders.reduce(function(sum, o) { return sum + (o.price || 0); }, 0);

    var orderTrend = yesterdayOrders.length > 0
      ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
      : 0;
    var revenueTrend = yesterdayRevenue > 0
      ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : 0;

    var completedOrders = orders.filter(function(o) { return o.status === 'Completed' && o.rating; });
    var avgRating = completedOrders.length > 0
      ? (completedOrders.reduce(function(sum, o) { return sum + o.rating; }, 0) / completedOrders.length).toFixed(1)
      : '0.0';

    updateElement('kpiTotalOrders', todayOrders.length);
    updateElement('kpiRevenue', formatCurrency(todayRevenue));
    updateElement('kpiCompleted', todayCompleted);
    updateElement('kpiPending', pendingOrders);
    updateElement('kpiActiveRiders', activeRiders);
    updateElement('kpiRating', avgRating);

    updateTrend('kpiOrderTrend', orderTrend);
    updateTrend('kpiRevenueTrend', revenueTrend);

    var completionRate = todayOrders.length > 0
      ? Math.round((todayCompleted / todayOrders.length) * 100)
      : 0;
    var completionEl = document.getElementById('kpiCompletionRate');
    if (completionEl) completionEl.textContent = completionRate + '%';

    renderOverviewCharts(orders);
    renderRecentOrders(orders.slice(0, 10));
  }

  function updateElement(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function updateTrend(id, value) {
    var el = document.getElementById(id);
    if (el) {
      var sign = value >= 0 ? '+' : '';
      el.textContent = sign + value + '%';
      el.className = 'kpi-trend ' + (value >= 0 ? 'positive' : 'negative');
    }
  }

  function renderOverviewCharts(orders) {
    var days = [];
    var orderCounts = [];
    var revenues = [];

    for (var i = 6; i >= 0; i--) {
      var dayStart = getDaysAgo(i + 1);
      var dayEnd = getDaysAgo(i);
      var dayOrders = orders.filter(function(o) { return o.timestamp >= dayStart && o.timestamp < dayEnd; });

      days.push(new Date(dayStart).toLocaleDateString('en-KE', { weekday: 'short' }));
      orderCounts.push(dayOrders.length);
      revenues.push(dayOrders.reduce(function(sum, o) { return sum + (o.price || 0); }, 0));
    }

    var ordersCtx = document.getElementById('ordersChart');
    if (ordersCtx) {
      if (charts.orders) charts.orders.destroy();
      charts.orders = new Chart(ordersCtx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Orders',
            data: orderCounts,
            borderColor: '#0b5ed7',
            backgroundColor: 'rgba(11,94,215,0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });
    }

    var revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
      if (charts.revenue) charts.revenue.destroy();
      charts.revenue = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: days,
          datasets: [{
            label: 'Revenue (KSh)',
            data: revenues,
            backgroundColor: '#10b981',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }

  function renderRecentOrders(orders) {
    var tbody = document.getElementById('recentOrdersBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;">No orders yet</td></tr>';
      return;
    }

    orders.forEach(function(order) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>#' + String(order.id).slice(-6) + '</td>' +
        '<td>' + escapeHtml(order.name) + '</td>' +
        '<td>' + getTypeLabel(order.type) + '</td>' +
        '<td>' + escapeHtml(order.pickup) + '</td>' +
        '<td>' + escapeHtml(order.delivery) + '</td>' +
        '<td>' + formatCurrency(order.price || 0) + '</td>' +
        '<td>' + getStatusBadge(order.status) + '</td>' +
        '<td>' + (order.rider || '-') + '</td>' +
        '<td>' + formatTime(order.timestamp) + '</td>' +
        '<td>' +
          '<button class="btn-action" onclick="window.assignRider(' + order.id + ')">👤</button>' +
          '<button class="btn-action" onclick="window.updateStatus(' + order.id + ')">✓</button>' +
          '<button class="btn-action" onclick="window.whatsappCustomer(\'' + order.phone + '\', \'' + escapeHtml(order.name) + '\')">💬</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
  }

  // =========================
  // ORDERS SECTION
  // =========================
  var currentPage = 1;
  var itemsPerPage = 15;

  function loadOrdersSection() {
    renderAllOrders(getOrders());
    setupOrderFilters();
  }

  function renderAllOrders(orders) {
    var tbody = document.getElementById('allOrdersBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:30px;">No orders found</td></tr>';
      return;
    }

    var start = (currentPage - 1) * itemsPerPage;
    var paginated = orders.slice(start, start + itemsPerPage);

    paginated.forEach(function(order) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><input type="checkbox" class="order-check" value="' + order.id + '"></td>' +
        '<td>#' + String(order.id).slice(-6) + '</td>' +
        '<td>' + escapeHtml(order.name) + '</td>' +
        '<td>' + order.phone + '</td>' +
        '<td>' + getTypeLabel(order.type) + '</td>' +
        '<td>' + escapeHtml(order.pickup) + '</td>' +
        '<td>' + escapeHtml(order.delivery) + '</td>' +
        '<td>' + (order.security || 'Standard') + '</td>' +
        '<td>' + formatCurrency(order.price || 0) + '</td>' +
        '<td>' + getStatusBadge(order.status) + '</td>' +
        '<td>' + formatTime(order.timestamp) + '</td>' +
        '<td>' +
          '<button class="btn-action" onclick="window.assignRider(' + order.id + ')">👤</button>' +
          '<button class="btn-action" onclick="window.updateStatus(' + order.id + ')">✓</button>' +
          '<button class="btn-action" onclick="window.deleteOrder(' + order.id + ')">🗑️</button>' +
        '</td>';
      tbody.appendChild(tr);
    });

    renderPagination(orders.length);
  }

  function renderPagination(total) {
    var container = document.getElementById('ordersPagination');
    if (!container) return;

    var pages = Math.ceil(total / itemsPerPage);
    var html = '';

    for (var i = 1; i <= pages; i++) {
      html += '<button class="page-btn ' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }

    container.innerHTML = html;

    container.querySelectorAll('.page-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        currentPage = parseInt(this.dataset.page);
        renderAllOrders(getOrders());
      });
    });
  }

  function setupOrderFilters() {
    var statusFilter = document.getElementById('orderStatusFilter');
    var typeFilter = document.getElementById('orderTypeFilter');
    var searchInput = document.getElementById('orderSearchInput');

    function filterOrders() {
      var orders = getOrders();

      if (statusFilter && statusFilter.value !== 'all') {
        orders = orders.filter(function(o) { return o.status === statusFilter.value; });
      }

      if (typeFilter && typeFilter.value !== 'all') {
        orders = orders.filter(function(o) { return o.type === typeFilter.value; });
      }

      if (searchInput && searchInput.value.trim()) {
        var query = searchInput.value.toLowerCase();
        orders = orders.filter(function(o) {
          return (o.name && o.name.toLowerCase().includes(query)) ||
            (o.phone && o.phone.includes(query)) ||
            (o.pickup && o.pickup.toLowerCase().includes(query)) ||
            (o.delivery && o.delivery.toLowerCase().includes(query)) ||
            String(o.id).includes(query);
        });
      }

      currentPage = 1;
      renderAllOrders(orders);
    }

    if (statusFilter) statusFilter.addEventListener('change', filterOrders);
    if (typeFilter) typeFilter.addEventListener('change', filterOrders);
    if (searchInput) searchInput.addEventListener('input', filterOrders);
  }

  // =========================
  // ANALYTICS SECTION
  // =========================
  function loadAnalytics() {
    var orders = getOrders();

    var weeklyCtx = document.getElementById('weeklyChart');
    if (weeklyCtx) {
      var days = [];
      var completedData = [];
      var pendingData = [];

      for (var i = 6; i >= 0; i--) {
        var dayStart = getDaysAgo(i + 1);
        var dayEnd = getDaysAgo(i);
        var dayOrders = orders.filter(function(o) { return o.timestamp >= dayStart && o.timestamp < dayEnd; });

        days.push(new Date(dayStart).toLocaleDateString('en-KE', { weekday: 'short' }));
        completedData.push(dayOrders.filter(function(o) { return o.status === 'Completed'; }).length);
        pendingData.push(dayOrders.filter(function(o) { return o.status === 'Pending'; }).length);
      }

      if (charts.weekly) charts.weekly.destroy();
      charts.weekly = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
          labels: days,
          datasets: [
            { label: 'Completed', data: completedData, backgroundColor: '#10b981', borderRadius: 6 },
            { label: 'Pending', data: pendingData, backgroundColor: '#f59e0b', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    var typeCtx = document.getElementById('orderTypeChart');
    if (typeCtx) {
      var typeCounts = {};
      orders.forEach(function(o) {
        typeCounts[o.type || 'parcel'] = (typeCounts[o.type || 'parcel'] || 0) + 1;
      });

      if (charts.type) charts.type.destroy();
      charts.type = new Chart(typeCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(typeCounts).map(getTypeLabel),
          datasets: [{
            data: Object.values(typeCounts),
            backgroundColor: ['#0b5ed7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    var zoneCtx = document.getElementById('zoneChart');
    if (zoneCtx) {
      var zoneCounts = {};
      orders.forEach(function(o) {
        var zone = o.pickup || 'Unknown';
        zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
      });

      var sortedZones = Object.entries(zoneCounts)
        .sort(function(a, b) { return b[1] - a[1]; })
        .slice(0, 6);

      if (charts.zone) charts.zone.destroy();
      charts.zone = new Chart(zoneCtx, {
        type: 'bar',
        data: {
          labels: sortedZones.map(function(z) { return z[0]; }),
          datasets: [{
            label: 'Orders',
            data: sortedZones.map(function(z) { return z[1]; }),
            backgroundColor: '#8b5cf6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    var timeCtx = document.getElementById('deliveryTimeChart');
    if (timeCtx) {
      if (charts.time) charts.time.destroy();
      charts.time = new Chart(timeCtx, {
        type: 'line',
        data: {
          labels: ['< 30min', '30-60min', '1-2hrs', '2-4hrs', '> 4hrs'],
          datasets: [{
            label: 'Deliveries',
            data: [12, 28, 35, 18, 7],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6,182,212,0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    var satCtx = document.getElementById('satisfactionChart');
    if (satCtx) {
      if (charts.satisfaction) charts.satisfaction.destroy();
      charts.satisfaction = new Chart(satCtx, {
        type: 'doughnut',
        data: {
          labels: ['5★', '4★', '3★', '2★', '1★'],
          datasets: [{
            data: [45, 28, 15, 8, 4],
            backgroundColor: ['#10b981', '#84cc16', '#f59e0b', '#f97316', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  // =========================
  // RIDERS SECTION
  // =========================
  function loadRiders() {
    var riders = getRiders();
    var grid = document.getElementById('riderGrid');
    if (!grid) return;

    grid.innerHTML = '';

    riders.forEach(function(rider) {
      var card = document.createElement('div');
      card.className = 'rider-card';
      card.innerHTML =
        '<div class="rider-avatar">' + rider.name.split(' ').map(function(n) { return n[0]; }).join('') + '</div>' +
        '<div class="rider-info">' +
          '<h4>' + escapeHtml(rider.name) + '</h4>' +
          '<p>📱 ' + rider.phone + '</p>' +
          '<p>📍 ' + rider.zone + '</p>' +
        '</div>' +
        '<div class="rider-stats">' +
          '<div class="rider-stat">' +
            '<div class="rider-stat-value">' + rider.deliveries + '</div>' +
            '<div class="rider-stat-label">Deliveries</div>' +
          '</div>' +
          '<div class="rider-stat">' +
            '<div class="rider-stat-value">' + rider.rating + '</div>' +
            '<div class="rider-stat-label">Rating</div>' +
          '</div>' +
          '<div class="rider-stat">' +
            '<div class="rider-stat-value">KSh ' + (rider.earnings / 1000).toFixed(1) + 'k</div>' +
            '<div class="rider-stat-label">Earnings</div>' +
          '</div>' +
        '</div>' +
        '<div class="rider-status ' + rider.status + '">' +
          (rider.status === 'active' ? '🟢 Active' : '⚪ Off Duty') +
        '</div>';
      grid.appendChild(card);
    });
  }

  // =========================
  // ZONE PERFORMANCE
  // =========================
  function loadZonePerformance() {
    var orders = getOrders();
    var grid = document.getElementById('zonePerformanceGrid');
    if (!grid) return;

    var zones = ['CBD', 'Westlands', 'Kilimani', 'Eastleigh', 'Karen', 'Thika Road', 'Mombasa Road', 'Ngong Road'];
    var zoneData = zones.map(function(zone) {
      var zoneOrders = orders.filter(function(o) { return o.pickup === zone || o.delivery === zone; });
      var completed = zoneOrders.filter(function(o) { return o.status === 'Completed'; });
      var revenue = zoneOrders.reduce(function(sum, o) { return sum + (o.price || 0); }, 0);
      return {
        name: zone,
        orders: zoneOrders.length,
        completed: completed.length,
        revenue: revenue,
        rate: zoneOrders.length > 0 ? Math.round((completed.length / zoneOrders.length) * 100) : 0
      };
    }).sort(function(a, b) { return b.orders - a.orders; });

    grid.innerHTML = '';

    zoneData.forEach(function(zone) {
      var card = document.createElement('div');
      card.className = 'zone-performance-card';
      card.innerHTML =
        '<h4>' + zone.name + '</h4>' +
        '<div class="zone-metrics">' +
          '<div class="zone-metric">' +
            '<div class="zone-metric-value">' + zone.orders + '</div>' +
            '<div class="zone-metric-label">Orders</div>' +
          '</div>' +
          '<div class="zone-metric">' +
            '<div class="zone-metric-value">' + zone.completed + '</div>' +
            '<div class="zone-metric-label">Completed</div>' +
          '</div>' +
          '<div class="zone-metric">' +
            '<div class="zone-metric-value">' + formatCurrency(zone.revenue) + '</div>' +
            '<div class="zone-metric-label">Revenue</div>' +
          '</div>' +
        '</div>' +
        '<div class="zone-rate">' +
          '<div class="rate-bar">' +
            '<div class="rate-fill" style="width:' + zone.rate + '%"></div>' +
          '</div>' +
          '<span>' + zone.rate + '% completion</span>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  // =========================
  // INSIGHTS SECTION
  // =========================
  function loadInsights() {
    var orders = getOrders();
    var grid = document.getElementById('insightsGrid');
    if (!grid) return;

    var todayStart = getTodayStart();
    var insights = [];

    // Revenue insight
    var weekRevenue = orders
      .filter(function(o) { return o.timestamp >= getDaysAgo(7); })
      .reduce(function(sum, o) { return sum + (o.price || 0); }, 0);
    var prevWeekRevenue = orders
      .filter(function(o) { return o.timestamp >= getDaysAgo(14) && o.timestamp < getDaysAgo(7); })
      .reduce(function(sum, o) { return sum + (o.price || 0); }, 0);

    if (weekRevenue > prevWeekRevenue * 1.1) {
      insights.push({
        icon: '📈',
        title: 'Revenue Growing',
        text: 'This week\'s revenue is ' + formatCurrency(weekRevenue) + ', up from ' + formatCurrency(prevWeekRevenue) + ' last week. Consider adding more riders during peak hours.',
        type: 'positive'
      });
    } else if (weekRevenue < prevWeekRevenue * 0.9) {
      insights.push({
        icon: '📉',
        title: 'Revenue Declining',
        text: 'Revenue dropped from ' + formatCurrency(prevWeekRevenue) + ' to ' + formatCurrency(weekRevenue) + '. Consider promotional discounts for business clients.',
        type: 'warning'
      });
    }

    // Pending orders insight
    var pendingCount = orders.filter(function(o) { return o.status === 'Pending'; }).length;
    if (pendingCount > 5) {
      insights.push({
        icon: '⚠️',
        title: 'Pending Orders Backlog',
        text: 'You have ' + pendingCount + ' pending orders waiting for rider assignment. Assign riders immediately to maintain service quality.',
        type: 'warning'
      });
    }

    // Zone performance
    var zoneCounts = {};
    orders.forEach(function(o) { zoneCounts[o.pickup] = (zoneCounts[o.pickup] || 0) + 1; });
    var topZone = Object.entries(zoneCounts).sort(function(a, b) { return b[1] - a[1]; })[0];
    if (topZone) {
      insights.push({
        icon: '📍',
        title: 'Top Pickup Zone',
        text: topZone[0] + ' is your busiest pickup area with ' + topZone[1] + ' orders. Consider stationing a dedicated rider here during business hours.',
        type: 'info'
      });
    }

    // Delivery type insight
    var typeCounts = {};
    orders.forEach(function(o) { typeCounts[o.type || 'parcel'] = (typeCounts[o.type || 'parcel'] || 0) + 1; });
    var topType = Object.entries(typeCounts).sort(function(a, b) { return b[1] - a[1]; })[0];
    if (topType) {
      insights.push({
        icon: '📦',
        title: 'Popular Service Type',
        text: getTypeLabel(topType[0]) + ' orders are most popular (' + topType[1] + ' orders). Ensure adequate supplies for this service category.',
        type: 'info'
      });
    }

    // Rider utilization
    var riders = getRiders();
    var activeRiders = riders.filter(function(r) { return r.status === 'active'; }).length;
    var todayOrders = orders.filter(function(o) { return o.timestamp >= todayStart; });
    if (activeRiders < 3 && todayOrders.length > 5) {
      insights.push({
        icon: '🚴',
        title: 'Low Rider Availability',
        text: 'Only ' + activeRiders + ' riders active with ' + todayOrders.length + ' orders today. Contact off-duty riders to come online.',
        type: 'warning'
      });
    }

    // Business hours insight
    var hourCounts = {};
    orders.forEach(function(o) {
      var hour = new Date(o.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    var peakHour = Object.entries(hourCounts).sort(function(a, b) { return b[1] - a[1]; })[0];
    if (peakHour) {
      var hour = parseInt(peakHour[0]);
      var timeLabel = hour >= 12 ? (hour === 12 ? '12' : hour - 12) + ' PM' : (hour === 0 ? '12' : hour) + ' AM';
      insights.push({
        icon: '⏰',
        title: 'Peak Hour Identified',
        text: 'Most orders come in at ' + timeLabel + ' (' + peakHour[1] + ' orders). Ensure maximum rider coverage during this window.',
        type: 'info'
      });
    }

    // Completion rate insight
    var completedTotal = orders.filter(function(o) { return o.status === 'Completed'; }).length;
    var completionRate = orders.length > 0 ? Math.round((completedTotal / orders.length) * 100) : 0;
    if (completionRate < 80) {
      insights.push({
        icon: '🎯',
        title: 'Completion Rate Below Target',
        text: 'Your completion rate is ' + completionRate + '%. Aim for 90%+ by following up on pending orders faster and reducing cancellations.',
        type: 'warning'
      });
    } else {
      insights.push({
        icon: '🏆',
        title: 'Excellent Completion Rate',
        text: 'Your completion rate is ' + completionRate + '%. Keep up the great work! Consider expanding to new zones.',
        type: 'positive'
      });
    }

    // Security orders insight
    var highSecurityOrders = orders.filter(function(o) { return o.security === 'High' || o.security === 'Maximum'; }).length;
    if (highSecurityOrders > 0) {
      insights.push({
        icon: '🔒',
        title: 'High-Security Revenue',
        text: highSecurityOrders + ' high-security orders processed. These command premium pricing — promote this service to law firms and financial institutions.',
        type: 'info'
      });
    }

    // Render insights
    grid.innerHTML = '';

    if (insights.length === 0) {
      grid.innerHTML = '<div class="insight-card"><p>No insights available yet. Process more orders to see recommendations.</p></div>';
      return;
    }

    insights.forEach(function(insight) {
      var card = document.createElement('div');
      card.className = 'insight-card ' + insight.type;
      card.innerHTML =
        '<div class="insight-icon">' + insight.icon + '</div>' +
        '<div class="insight-content">' +
          '<h4>' + insight.title + '</h4>' +
          '<p>' + insight.text + '</p>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  // =========================
  // SETTINGS
  // =========================
  function loadSettings() {
    var savePasswordBtn = document.getElementById('savePasswordBtn');
    if (savePasswordBtn) {
      savePasswordBtn.addEventListener('click', function() {
        var newPass = document.getElementById('settingsPassword').value;
        if (newPass && newPass.length >= 6) {
          localStorage.setItem(AUTH_PASSWORD_KEY, newPass);
          alert('Password updated successfully!');
          document.getElementById('settingsPassword').value = '';
        } else {
          alert('Password must be at least 6 characters.');
        }
      });
    }

    var savePricingBtn = document.getElementById('savePricingBtn');
    if (savePricingBtn) {
      savePricingBtn.addEventListener('click', function() {
        var basePrice = document.getElementById('basePrice').value;
        var pricePerKm = document.getElementById('pricePerKm').value;
        var expressMult = document.getElementById('expressMultiplier').value;

        localStorage.setItem('swiftBasePrice', basePrice);
        localStorage.setItem('swiftPricePerKm', pricePerKm);
        localStorage.setItem('swiftExpressMult', expressMult);
        alert('Pricing settings saved!');
      });
    }

    var savedBase = localStorage.getItem('swiftBasePrice');
    if (savedBase) document.getElementById('basePrice').value = savedBase;
    var savedPerKm = localStorage.getItem('swiftPricePerKm');
    if (savedPerKm) document.getElementById('pricePerKm').value = savedPerKm;
    var savedMult = localStorage.getItem('swiftExpressMult');
    if (savedMult) document.getElementById('expressMultiplier').value = savedMult;

    var saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', function() {
        var waNumber = document.getElementById('whatsappNumber').value;
        var autoNotify = document.getElementById('autoNotify').value;

        localStorage.setItem('swiftWhatsapp', waNumber);
        localStorage.setItem('swiftAutoNotify', autoNotify);
        alert('Settings saved!');
      });
    }

    var savedWa = localStorage.getItem('swiftWhatsapp');
    if (savedWa) document.getElementById('whatsappNumber').value = savedWa;

    var exportAllBtn = document.getElementById('exportAllBtn');
    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', function() {
        var data = {
          orders: getOrders(),
          riders: getRiders(),
          exportedAt: new Date().toISOString()
        };

        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'swift-courier-data-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    var clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function() {
        if (confirm('⚠️ WARNING: This will delete ALL orders and rider data. This cannot be undone!\n\nAre you sure?')) {
          if (confirm('Final confirmation: Delete all data?')) {
            localStorage.removeItem('orders');
            localStorage.removeItem('riders');
            alert('All data cleared. Reloading...');
            window.location.reload();
          }
        }
      });
    }
  }

  // =========================
  // GLOBAL FUNCTIONS
  // =========================
  window.assignRider = function(orderId) {
    var orders = getOrders();
    var order = orders.find(function(o) { return o.id === orderId; });
    if (!order) return;

    var rider = prompt('Enter Rider Phone (2547XXXXXXXX):');
    if (!rider || !/^2547\d{8}$/.test(rider)) {
      alert('Invalid phone number. Use format 2547XXXXXXXX.');
      return;
    }

    var riderName = prompt('Enter Rider Name:');
    if (!riderName) return;

    var message =
      '🚴 NEW DELIVERY JOB\n' +
      '👤 Customer: ' + (order.name || '') + '\n' +
      '📞 ' + (order.phone || '') + '\n' +
      '📍 Pickup: ' + (order.pickup || '') + '\n' +
      '🏁 Delivery: ' + (order.delivery || '') + '\n' +
      '🔒 Security: ' + (order.security || 'Standard') + '\n' +
      '💰 Pay: Ksh ' + (order.price || '0');

    window.open(
      'https://wa.me/' + encodeURIComponent(rider) + '?text=' + encodeURIComponent(message),
      '_blank'
    );

    order.status = 'Assigned';
    order.rider = riderName;
    saveOrders(orders);
    loadOverview();
    loadOrdersSection();
  };

  window.updateStatus = function(orderId) {
    var orders = getOrders();
    var order = orders.find(function(o) { return o.id === orderId; });
    if (!order) return;

    var statuses = ['Pending', 'Assigned', 'In Transit', 'Completed', 'Cancelled'];
    var newStatus = prompt('Update status to:\n' + statuses.join(', '));

    if (newStatus && statuses.includes(newStatus)) {
      order.status = newStatus;
      saveOrders(orders);
      loadOverview();
      loadOrdersSection();
    }
  };

  window.deleteOrder = function(orderId) {
    if (!confirm('Delete this order?')) return;

    var orders = getOrders().filter(function(o) { return o.id !== orderId; });
    saveOrders(orders);
    loadOverview();
    loadOrdersSection();
    loadInsights();
  };

  window.whatsappCustomer = function(phone, name) {
    var message = 'Hello ' + (name || 'there') + ', this is Swift Courier. Regarding your delivery...';
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(message), '_blank');
  };

  // =========================
  // UTILITIES
  // =========================
  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function exportData() {
    var orders = getOrders();
    var csv = [
      ['ID', 'Customer', 'Phone', 'Type', 'Security', 'Pickup', 'Delivery', 'Price', 'Status', 'Rider', 'Date'].join(','),
      ...orders.map(function(o) {
        return [
          o.id, o.name, o.phone, o.type, o.security || 'Standard', o.pickup, o.delivery, o.price || 0, o.status, o.rider || '', new Date(o.timestamp).toISOString()
        ].map(function(v) { return '"' + (v || '') + '"'; }).join(',');
      })
    ].join('\n');

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'swift-courier-orders-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

})();
