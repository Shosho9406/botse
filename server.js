const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');

// Load environment variables from .env file if it exists
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.trim().split('=');
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Logging middleware
const log = (level, msg) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${msg}`);
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  log('INFO', `${req.method} ${req.path}`);
  next();
});

// Serve static front-end
app.use(express.static(path.join(__dirname, 'public')));

// Simple products list (reflects the site content)
const products = [
  { id: 'open-slouchy', name: 'Open Slouchy', prices: { one: 120, two: 150, three: 180, custom: 200 } },
  { id: 'normal-slouchy', name: 'Normal Slouchy', prices: { one: 180, two: 200, three: 230, custom: 280 } },
  { id: 'big-slouchy', name: 'Big Slouchy', prices: { one: 250, two: 270, three: 290, custom: 320 } },
  { id: 'scrunchie-small', name: 'Scrunchie (Small)', prices: { base: 15, extraColour: 10 } },
  { id: 'scrunchie-medium', name: 'Scrunchie (Medium)', prices: { base: 35, extraColour: 10 } },
  { id: 'scrunchie-large', name: 'Scrunchie (Large)', prices: { base: 50, extraColour: 20 } }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    // Basic server-side validation & sanitization
    let { productId, variant, quantity, name, phone, address, notes } = req.body || {};
    productId = (productId || '').toString().trim();
    name = (name || '').toString().trim();
    phone = (phone || '').toString().replace(/\D/g, ''); // keep digits only
    quantity = parseInt(quantity || 1, 10) || 1;

    if (!productId || !name || !phone) {
      return res.status(400).json({ error: 'Missing required fields: productId, name, phone' });
    }

    const product = products.find(p => p.id === productId);
    if (!product) return res.status(400).json({ error: 'Invalid productId' });

    // Simple price calculation (fallbacks)
    let unitPrice = 0;
    if (product.prices.one && variant === 'one') unitPrice = product.prices.one;
    else if (product.prices.two && variant === 'two') unitPrice = product.prices.two;
    else if (product.prices.three && variant === 'three') unitPrice = product.prices.three;
    else if (product.prices.custom && variant === 'custom') unitPrice = product.prices.custom;
    else if (product.prices.base) unitPrice = product.prices.base;
    else unitPrice = Object.values(product.prices)[0] || 0;

    const total = Math.round((unitPrice * quantity) * 100) / 100;

    const deposit = Math.round((total * 0.5) * 100) / 100;

    const order = {
      productId,
      productName: product.name,
      variant: variant || '',
      quantity,
      unitPrice,
      total,
      name,
      phone,
      address: address || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentReceived: false,
      depositAmount: deposit
    };

    const id = await db.insertOrder(order);

    // Return created order id and deposit info
    res.json({ id, order: { id, ...order }, payment: { deposit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List orders (simple admin endpoint)
app.get('/api/orders', async (req, res) => {
  const rows = await db.getOrders();
  res.json(rows);
});

// Get single order details (used by payment page)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const row = await db.getOrderById(id);
    if (!row) return res.status(404).json({ error: 'Order not found' });
    const deposit = Math.round((row.total * 0.5) * 100) / 100;
    res.json({ order: row, payment: { deposit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark order as paid (admin or webhook can call)
app.post('/api/orders/:id/pay', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const amount = parseFloat(req.body.amount || 0);
    await db.markOrderPaid(id, amount);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Payment gateway webhook (placeholder)
app.post('/api/payments/webhook', async (req, res) => {
  // This is a simple webhook endpoint that payment providers can call to notify of a payment.
  // In production you should verify signatures and provider authenticity.
  try {
    const { orderId, amount, status } = req.body || {};
    const id = parseInt(orderId, 10);
    if (!id) return res.status(400).json({ error: 'Invalid orderId' });
    if (status === 'paid') {
      await db.markOrderPaid(id, amount || 0);
      return res.json({ ok: true });
    }
    // For other statuses, update order status
    if (status) await db.updateOrderStatus(id, status);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Basic admin auth middleware for simple admin UI protection
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  // Expect Basic base64(user:pass)
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).set('WWW-Authenticate', 'Basic realm="Admin"').json({ error: 'Authentication required' });
  }
  try {
    const creds = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8').split(':');
    const [user, pass] = creds;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      return next();
    }
    return res.status(403).json({ error: 'Invalid credentials' });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authorization header' });
  }
}

// Admin list (protected)
app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    const rows = await db.getOrders(search, status);
    res.json(rows);
  } catch (err) {
    log('ERROR', `Error fetching orders: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export orders to CSV (protected)
app.get('/api/admin/orders/export/csv', adminAuth, async (req, res) => {
  try {
    const rows = await db.getOrders();
    if (!rows || rows.length === 0) {
      return res.json({ error: 'No orders to export' });
    }
    
    const headers = ['ID', 'Product', 'Variant', 'Quantity', 'Unit Price', 'Total', 'Name', 'Phone', 'Address', 'Notes', 'Status', 'Paid', 'Created'];
    const csv = [headers.map(h => `"${h}"`).join(',')];
    
    rows.forEach(o => {
      csv.push([
        o.id,
        `"${o.productName}"`,
        `"${o.variant || ''}"`,
        o.quantity,
        o.unitPrice,
        o.total,
        `"${o.name}"`,
        `"${o.phone}"`,
        `"${o.address || ''}"`,
        `"${o.notes || ''}"`,
        o.status,
        o.paymentReceived ? 'Yes' : 'No',
        new Date(o.createdAt).toLocaleDateString()
      ].join(','));
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv.join('\n'));
  } catch (err) {
    log('ERROR', `Error exporting orders: ${err.message}`);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Get analytics (protected)
app.get('/api/admin/analytics', adminAuth, async (req, res) => {
  try {
    const stats = await db.getAnalytics();
    res.json(stats);
  } catch (err) {
    log('ERROR', `Error getting analytics: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server only when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    log('INFO', `Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
    log('INFO', `Admin credentials: ${ADMIN_USER}/${ADMIN_PASS === 'password' ? '(default - CHANGE IN PRODUCTION)' : '***'}`);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  log('ERROR', `Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
