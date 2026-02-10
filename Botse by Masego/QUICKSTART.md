# Quick Start Guide - Botse by Masego

## 🚀 Getting Started in 2 Minutes

### Step 1: Install Dependencies
```powershell
cd "C:\Users\User\Desktop\Botse by Masego"
npm install
```

### Step 2: Start the Server
```powershell
npm start
# or: node server.js
```

You should see:
```
[TIMESTAMP] [INFO] Server running in development mode on http://localhost:3000
[TIMESTAMP] [INFO] Admin credentials: admin/(default - CHANGE IN PRODUCTION)
```

### Step 3: Visit in Browser
- **Home**: http://localhost:3000
- **Products**: http://localhost:3000/products.html
- **Order Form**: http://localhost:3000/order.html
- **Admin Dashboard**: http://localhost:3000/admin.html

## 🔑 Admin Login
- **Username**: `admin`
- **Password**: `password`

## 📝 Test an Order

1. Go to http://localhost:3000/order.html
2. Fill out the form:
   - Select a product (e.g., "Open Slouchy")
   - Enter variant (e.g., "one")
   - Quantity: 1
   - Name: Your name
   - Phone: 0791234567
3. Click "Place Order & View Payment"
4. You'll see the payment page with deposit amount
5. Check admin dashboard to see your order

## 📊 Admin Dashboard Features

After logging in at http://localhost:3000/admin.html:

- **Search Orders** - Type to find by ID, name, phone, or product
- **Filter by Status** - pending, paid, completed
- **View Statistics** - Total orders, revenue, paid/pending
- **Mark as Paid** - Click button to confirm payment received
- **Export to CSV** - Download all orders as spreadsheet
- **Refresh** - Reload orders from database

## 🗄️ Database

Orders are stored in `data/orders.db` (SQLite)

View with any SQLite tool, or run:
```powershell
# Install sqlite3 CLI if needed
# Then:
sqlite3 "data/orders.db"
.schema orders
SELECT * FROM orders;
```

## ⚙️ Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```env
PORT=3000
NODE_ENV=development
ADMIN_USER=admin
ADMIN_PASS=your-secure-password
```

**Important**: Change admin credentials before deploying!

## 🧪 Run Tests

```powershell
npm test
```

This creates a sample order and shows the response.

## 🛠️ Development Commands

```powershell
# Start server with auto-reload (requires nodemon)
npm run dev

# Run tests
npm test

# Start production server
NODE_ENV=production node server.js
```

## 📋 Project Structure

```
├── server.js              # Express server
├── db.js                  # SQLite setup
├── public/
│   ├── index.html         # Home page
│   ├── products.html      # Product listing
│   ├── order.html         # Order form
│   ├── payment.html       # Payment page
│   ├── admin.html         # Admin dashboard
│   ├── app.js             # Order/payment logic
│   └── admin.js           # Admin logic
├── data/
│   └── orders.db          # Database file
├── test/
│   └── test_order.js      # Test script
└── README.md              # Full documentation
```

## 🌐 API Endpoints

### Public
```
GET  /api/products           # Get all products
POST /api/orders             # Create order
GET  /api/orders/:id         # Get order details
```

### Admin (requires auth)
```
GET  /api/admin/orders       # List orders (search & filter)
POST /api/orders/:id/pay     # Mark as paid
GET  /api/admin/orders/export/csv  # Export CSV
GET  /api/admin/analytics    # Sales statistics
```

## 💰 How It Works

1. **Customer orders** → Selects product + quantity
2. **Price calculated** → Real-time as they select
3. **50% deposit** → Automatically calculated
4. **Payment page** → Shows bank details + WhatsApp link
5. **Admin reviews** → See order in dashboard
6. **Mark as paid** → After customer sends payment proof
7. **Order complete** → Customer notified via WhatsApp

## 🎯 Common Tasks

### Change Admin Password
Edit `.env` or `server.js`:
```javascript
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'your-new-password';
```

### View All Orders
Admin Dashboard → No filters needed to see all

### Find Specific Order
Admin Dashboard → Type in search box (searches: ID, name, phone, product)

### Export Orders for Accounting
Admin Dashboard → "Export CSV" button

### See Sales Statistics
Admin Dashboard → Statistics boxes at top show:
- Total orders
- Number paid
- Total revenue
- Paid/Pending split

### View Database Directly
```powershell
cd "data"
sqlite3 orders.db
SELECT * FROM orders;
.quit
```

## 🐛 Troubleshooting

**Server won't start:**
- Check port 3000 is not in use: `netstat -ano | findstr :3000`
- Kill process: `taskkill /PID <PID> /F`
- Try different port: `PORT=3001 node server.js`

**Admin login not working:**
- Default credentials: `admin` / `password`
- Check browser console for errors (F12)
- Clear browser cache/cookies

**Orders not saving:**
- Check `data/` folder exists
- Verify write permissions
- Check database isn't locked

**Real-time prices not updating:**
- Refresh page
- Check browser console for JS errors (F12)
- Verify products loaded from API

## 📧 Support

For issues or questions:
1. Check the README.md for full documentation
2. Review IMPROVEMENTS.md for what was added
3. Check server logs in terminal
4. Check browser console (F12 Dev Tools)

## 🎉 You're Ready!

Your handmade products e-commerce site is now live locally. Time to:
- ✅ Add your product images to `public/images/`
- ✅ Test the order flow
- ✅ Check the admin dashboard
- ✅ When ready, deploy to production!

---

**Happy selling!** 🎨
