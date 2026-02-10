// Admin Dashboard
(function () {
  function b64(u, p) { return btoa(u + ':' + p); }

  const loginBtn = document.getElementById('loginBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const searchBox = document.getElementById('searchBox');
  const statusFilter = document.getElementById('statusFilter');
  const exportBtn = document.getElementById('exportBtn');
  const ordersArea = document.getElementById('ordersArea');
  const loginArea = document.getElementById('loginArea');
  const ordersTbody = document.getElementById('ordersTbody');
  const statsDiv = document.getElementById('stats');

  function getCreds() {
    const u = localStorage.getItem('admin_user');
    const p = localStorage.getItem('admin_pass');
    if (u && p) return { u, p };
    return null;
  }

  function setCreds(u, p) {
    localStorage.setItem('admin_user', u);
    localStorage.setItem('admin_pass', p);
  }

  function clearCreds() {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_pass');
  }

  async function fetchStats() {
    const creds = getCreds();
    if (!creds) return;
    const headers = { 'Authorization': 'Basic ' + b64(creds.u, creds.p) };
    try {
      const r = await fetch(apiUrl('/api/admin/analytics'), { headers });
      if (r.status === 401 || r.status === 403) return showLogin();
      const stats = await r.json();
      renderStats(stats);
    } catch (err) {
      console.error(err);
    }
  }

  function renderStats(stats) {
    const html = `
      <div class="stat-box">
        <h3>Total Orders</h3>
        <div class="value">${stats.totalOrders || 0}</div>
      </div>
      <div class="stat-box">
        <h3>Paid Orders</h3>
        <div class="value">${stats.paidOrders || 0}</div>
      </div>
      <div class="stat-box">
        <h3>Total Revenue</h3>
        <div class="value">R${(stats.totalRevenue || 0).toFixed(2)}</div>
      </div>
      <div class="stat-box">
        <h3>Paid Revenue</h3>
        <div class="value">R${(stats.paidRevenue || 0).toFixed(2)}</div>
      </div>
    `;
    statsDiv.innerHTML = html;
  }

  async function fetchOrders(search = '', status = '') {
    const creds = getCreds();
    if (!creds) return showLogin();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const headers = { 'Authorization': 'Basic ' + b64(creds.u, creds.p) };
    try {
      const r = await fetch(apiUrl(`/api/admin/orders?${params}`), { headers });
      if (r.status === 401 || r.status === 403) return showLogin();
      const list = await r.json();
      renderOrders(list);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
    }
  }

  function renderOrders(list) {
    if (!list || list.length === 0) {
      ordersTbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#999;">No orders found</td></tr>';
      return;
    }
    ordersTbody.innerHTML = '';
    list.forEach(o => {
      const tr = document.createElement('tr');
      const statusClass = o.paymentReceived ? 'status-paid' : 'status-pending';
      tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.productName}</td>
        <td>${o.variant || '—'}</td>
        <td>${o.name}</td>
        <td>${o.phone}</td>
        <td>R${o.total}</td>
        <td>R${(o.depositAmount || 0).toFixed(2)}</td>
        <td><span class="${statusClass}">${o.status}${o.paymentReceived ? ' ✓' : ''}</span></td>
        <td><button class="markPaid btn" data-id="${o.id}">Mark Paid</button></td>
      `;
      ordersTbody.appendChild(tr);
    });

    // attach handlers
    document.querySelectorAll('.markPaid').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (!confirm('Mark order ' + id + ' as paid?')) return;
        const creds = getCreds();
        const headers = { 'Authorization': 'Basic ' + b64(creds.u, creds.p), 'Content-Type': 'application/json' };
        try {
          const r = await fetch(apiUrl(`/api/orders/${id}/pay`), { method: 'POST', headers, body: JSON.stringify({ amount: 0 }) });
          if (!r.ok) throw new Error('Failed');
          alert('Order marked as paid');
          fetchOrders(searchBox.value, statusFilter.value);
          fetchStats();
        } catch (err) {
          console.error(err);
          alert('Failed to mark paid');
        }
      });
    });
  }

  function showLogin() {
    loginArea.style.display = '';
    ordersArea.style.display = 'none';
  }

  function showOrders() {
    loginArea.style.display = 'none';
    ordersArea.style.display = 'block';
    const creds = getCreds();
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg && creds) {
      const name = creds.u.charAt(0).toUpperCase() + creds.u.slice(1);
      welcomeMsg.innerHTML = `
        <h2>Welcome, ${name}! 👋</h2>
        <p>Your business at a glance</p>
      `;
    }
  }

  loginBtn && loginBtn.addEventListener('click', async () => {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    if (!u || !p) {
      alert('Please enter both username and password');
      return;
    }

    // Try to authenticate by fetching orders
    const headers = { 'Authorization': 'Basic ' + btoa(u + ':' + p) };
    try {
      const r = await fetch(apiUrl('/api/admin/orders'), { headers });
      if (r.status === 401 || r.status === 403) {
        alert('Invalid username or password');
        return;
      }
      if (!r.ok) {
        throw new Error('Authentication failed');
      }
      
      // If successful, save credentials and show dashboard
      setCreds(u, p);
      showOrders();
      fetchStats();
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + err.message);
    }
  });

  refreshBtn && refreshBtn.addEventListener('click', () => {
    fetchStats();
    fetchOrders(searchBox.value, statusFilter.value);
  });

  searchBox && searchBox.addEventListener('input', () => {
    fetchOrders(searchBox.value, statusFilter.value);
  });

  statusFilter && statusFilter.addEventListener('change', () => {
    fetchOrders(searchBox.value, statusFilter.value);
  });

  exportBtn && exportBtn.addEventListener('click', async () => {
    const creds = getCreds();
    if (!creds) return alert('Not authenticated');
    const headers = { 'Authorization': 'Basic ' + b64(creds.u, creds.p) };
    try {
      const r = await fetch(apiUrl('/api/admin/orders/export/csv'), { headers });
      if (!r.ok) throw new Error('Export failed');
      const csv = await r.text();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to export');
    }
  });

  logoutBtn && logoutBtn.addEventListener('click', () => { clearCreds(); showLogin(); });

  // On load, if creds exist, show orders
  if (getCreds()) { showOrders(); fetchStats(); fetchOrders(); }
})();
