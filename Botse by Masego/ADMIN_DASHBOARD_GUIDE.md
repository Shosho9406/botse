# Admin Dashboard Guide - What You'll See

## Login Page

When you first visit `http://localhost:3000/admin.html`, you'll see:

```
┌─────────────────────────────────────┐
│      Botse Admin                    │
│  Manage your orders and track       │
│  your business                      │
├─────────────────────────────────────┤
│                                     │
│   Username: [              ]        │
│   Password: [              ]        │
│                                     │
│     [ Login to Dashboard ]          │
│                                     │
│   Secure authentication required    │
└─────────────────────────────────────┘
```

**Login Credentials:**
- Username: `masego`
- Password: `BotseAdmin2026!`

---

## After Login - Main Dashboard

Once logged in, you'll see the full admin dashboard with:

### 1️⃣ **Welcome Section**
```
┌──────────────────────────────────────────────────────┐
│  Welcome, Masego! 👋                     [Logout]    │
│  Your business at a glance                          │
└──────────────────────────────────────────────────────┘
```

### 2️⃣ **Statistics Dashboard** (4-Box Grid)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total Orders │  │ Paid Orders  │  │Total Revenue │  │Paid Revenue  │
│              │  │              │  │              │  │              │
│     42       │  │     28       │  │   R12,540    │  │   R10,200    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

**Shows:**
- **Total Orders**: All orders received (pending + paid + completed)
- **Paid Orders**: Orders with full or deposit payment received
- **Total Revenue**: Sum of all order totals (R amount)
- **Paid Revenue**: Amount actually paid by customers

### 3️⃣ **Control Panel**

```
┌──────────────────────────────────────────────────────────────────┐
│ [Search box.................] [Status ▼] [Refresh] [Export CSV] │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- **Search**: Find orders by ID, customer name, phone number, or product
- **Status Filter**: View pending, paid, or completed orders only
- **Refresh**: Reload data (auto-refreshes every 30 seconds)
- **Export CSV**: Download all visible orders as spreadsheet

### 4️⃣ **Orders Table**

```
┌──────┬────────────┬──────────┬──────────┬────────────┬───────┬────────┬─────────┬─────────┐
│ ID   │ Product    │ Variant  │ Name     │ Phone      │ Total │ Deposit│ Status  │ Actions │
├──────┼────────────┼──────────┼──────────┼────────────┼───────┼────────┼─────────┼─────────┤
│ 1    │ Slouchy    │ Open     │ Thandi   │ 0695895793 │R150   │R75.00  │ pending │ Mark... │
├──────┼────────────┼──────────┼──────────┼────────────┼───────┼────────┼─────────┼─────────┤
│ 2    │ Scrunchie  │ Medium   │ Naledi   │ 0798765432 │R35    │R17.50  │ paid ✓  │ Mark... │
├──────┼────────────┼──────────┼──────────┼────────────┼───────┼────────┼─────────┼─────────┤
│ 3    │ Slouchy    │ Big      │ Amara    │ 0681234567 │R250   │R125.00 │ pending │ Mark... │
└──────┴────────────┴──────────┴──────────┴────────────┴───────┴────────┴─────────┴─────────┘
```

**Columns:**
- **ID**: Order number
- **Product**: Type of item ordered (Slouchy, Scrunchie)
- **Variant**: Specific version (Open, Normal, Big, Medium, Small, etc.)
- **Name**: Customer's full name
- **Phone**: Customer's WhatsApp/phone number
- **Total**: Full order amount in Rands
- **Deposit**: 50% deposit amount (what you should receive first)
- **Status**: Order status (pending, paid, completed)
  - `paid ✓` = Payment received
- **Actions**: "Mark Paid" button to confirm payment

---

## How to Use Each Feature

### 📊 Understanding Statistics

The 4 statistics boxes at the top give you instant business insights:

**Example Scenario:**
```
Total Orders: 50
Paid Orders: 35
Total Revenue: R5,000
Paid Revenue: R3,500
```

This means:
- 50 customers have placed orders
- 35 have paid (70% payment rate)
- Total value of all orders is R5,000
- You've actually received R3,500
- You're waiting for R1,500 from 15 customers

### 🔍 Using Search

```
Search box: "thandi"
↓
Shows only orders from customer named Thandi
```

```
Search box: "0695895793"
↓
Shows orders from that phone number
```

```
Search box: "slouchy"
↓
Shows all Slouchy Beanie orders
```

### 📋 Using Status Filter

```
Status: All statuses → Shows everything
Status: Pending → Shows unpaid orders (needs follow-up)
Status: Paid → Shows orders with payment received
Status: Completed → Shows fulfilled orders
```

### ✅ Marking Orders as Paid

1. Find the order in the table
2. Click **"Mark Paid"** button
3. Confirm in the popup dialog
4. Order status updates to "paid ✓"
5. Statistics automatically refresh

### 📥 Exporting to CSV

1. Click **"Export CSV"** button
2. File downloads: `orders_2026-01-12.csv`
3. Open in Excel/Sheets to:
   - Print customer contact details
   - Track inventory
   - Create billing records
   - Archive orders

### 🔄 Auto-Refresh

Dashboard automatically refreshes every 30 seconds with new orders. You can also click **"Refresh"** anytime for instant update.

---

## Typical Daily Workflow

### Morning Check ☀️
1. Login to admin dashboard
2. Check statistics to see overnight orders
3. Review "pending" status orders
4. WhatsApp customers to confirm orders and collect payment info

### When Payment Received 💰
1. Find order in table (use search if needed)
2. Click **"Mark Paid"**
3. Confirm payment
4. Statistics update automatically

### End of Day 📋
1. Export CSV of all orders
2. Add production notes
3. Review statistics for the day
4. Logout

### Weekly/Monthly Tasks 📊
1. Export CSV for accounting
2. Backup database (data/orders.db file)
3. Check total revenue for the period
4. Plan production based on pending orders

---

## Tips & Tricks

✅ **Search is powerful**: Try searching by customer name, phone, product type, or order ID
✅ **Real-time updates**: Data refreshes automatically every 30 seconds
✅ **Mobile friendly**: Dashboard works on phones and tablets (though table scrolls)
✅ **Secure login**: Credentials are encrypted using Base64 authentication
✅ **Easy export**: Download CSV for Excel, accounting, or record-keeping
✅ **Persistent login**: Browser remembers your login until you close it

---

## Troubleshooting

**"Login failed" error**
- Check spelling of username/password
- Verify .env file exists with correct credentials
- Restart server: `node server.js`

**"Cannot find orders" error**
- Ensure server is running
- Check browser console for error messages
- Try refreshing the page

**"Export not working"**
- Check browser pop-up blocker settings
- Try different browser
- Verify server is running

**Lost connection**
- Click "Refresh" button
- Re-login if session expired
- Check that server is still running

---

## What Happens After You Close Browser?

- Session is cleared (for security)
- Next login requires username/password again
- All data is preserved in database
- No orders or customer info is lost

---

## Keep These Safe

🔐 **Important**: Keep your admin credentials secure!
- Don't share username/password
- Don't use weak passwords
- Change password regularly in production
- Keep .env file confidential

For production deployment, see **DEPLOYMENT.md** for additional security steps.
