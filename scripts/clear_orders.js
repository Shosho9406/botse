// Clear all test orders from the database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/orders.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run('DELETE FROM orders', function (err) {
    if (err) {
      console.error('Error clearing orders:', err);
      process.exit(1);
    }
    console.log('✓ All test orders have been deleted.');
    console.log('Database is now clean and ready for production orders.');
    db.close();
    process.exit(0);
  });
});
