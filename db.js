const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const DB_PATH = path.join(dataDir, 'orders.db');

const db = new sqlite3.Database(DB_PATH);

// Initialize table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT,
      productName TEXT,
      variant TEXT,
      quantity INTEGER,
      unitPrice REAL,
      total REAL,
      name TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT,
      createdAt TEXT,
      status TEXT DEFAULT 'pending',
      paymentReceived INTEGER DEFAULT 0,
      depositAmount REAL DEFAULT 0
    )
  `);
  // Ensure new columns exist for older DBs (ALTER TABLE ADD COLUMN is safe if column missing)
  db.run(`ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending'`, () => {});
  db.run(`ALTER TABLE orders ADD COLUMN paymentReceived INTEGER DEFAULT 0`, () => {});
  db.run(`ALTER TABLE orders ADD COLUMN depositAmount REAL DEFAULT 0`, () => {});
});

function insertOrder(order) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO orders (productId, productName, variant, quantity, unitPrice, total, name, phone, address, notes, createdAt, status, paymentReceived, depositAmount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    stmt.run(
      order.productId,
      order.productName,
      order.variant,
      order.quantity,
      order.unitPrice,
      order.total,
      order.name,
      order.phone,
      order.address,
      order.notes,
      order.createdAt,
      order.status || 'pending',
      order.paymentReceived ? 1 : 0,
      order.depositAmount || 0,
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
    stmt.finalize();
  });
}

function getOrders(search = '', status = '') {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM orders WHERE 1=1`;
    const params = [];
    
    if (search) {
      query += ` AND (name LIKE ? OR phone LIKE ? OR productName LIKE ? OR id LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY id DESC LIMIT 100`;
    
    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getOrderById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM orders WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function markOrderPaid(id, paidAmount) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`UPDATE orders SET paymentReceived = 1, status = 'paid', depositAmount = ? WHERE id = ?`);
    stmt.run(paidAmount || 0, id, function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
    stmt.finalize();
  });
}

function updateOrderStatus(id, status) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`UPDATE orders SET status = ? WHERE id = ?`);
    stmt.run(status, id, function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
    stmt.finalize();
  });
}

function getAnalytics() {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN paymentReceived = 1 THEN 1 ELSE 0 END) as paidOrders,
        SUM(total) as totalRevenue,
        SUM(CASE WHEN paymentReceived = 1 THEN total ELSE 0 END) as paidRevenue,
        SUM(CASE WHEN paymentReceived = 0 THEN total ELSE 0 END) as pendingRevenue
      FROM orders
    `, (err, row) => {
      if (err) return reject(err);
      resolve(row || {});
    });
  });
}

module.exports = { insertOrder, getOrders, getOrderById, markOrderPaid, updateOrderStatus, getAnalytics, db };
