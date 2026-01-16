# Admin Access Guide - Botse by Masego

## Quick Start

The admin dashboard is accessible at: **http://localhost:3000/admin.html**

### Default Credentials
- **Username**: `admin`
- **Password**: `password`

⚠️ **IMPORTANT**: Change these credentials immediately for security!

---

## Setting Up Your Own Admin Credentials

### Step 1: Create a `.env` file

In the project root directory (`c:\Users\User\Desktop\Botse by Masego\`), create a new file called `.env` with:

```
ADMIN_USER=your_username
ADMIN_PASS=your_secure_password
NODE_ENV=production
PORT=3000
```

**Example:**
```
ADMIN_USER=masego
ADMIN_PASS=MySecurePassword123!
NODE_ENV=production
PORT=3000
```

### Step 2: Restart the Server

1. Stop the running server (press `Ctrl+C` in the terminal)
2. Run: `node server.js`
3. The console will show your new credentials:
   ```
   [INFO] Admin credentials: masego/(your password)
   ```

### Step 3: Login to Admin Dashboard

1. Go to: `http://localhost:3000/admin.html`
2. Enter your username and password
3. Click **Login**

---

## What You Can Do in the Admin Dashboard

### 📊 View Statistics
- **Total Orders**: Count of all orders received
- **Paid Orders**: Number of fully paid orders
- **Total Revenue**: Sum of all order amounts
- **Pending Revenue**: Amount awaiting payment

### 🔍 Search & Filter Orders
- Search by customer name, phone, or product
- Filter by order status (pending, completed, etc.)
- View complete order details

### ✅ Mark Orders as Paid
- Click **Mark Paid** next to any order
- Confirms payment received
- Updates customer payment status

### 📥 Export to CSV
- Click **Export CSV** button
- Downloads all orders as a spreadsheet
- Useful for accounting and record-keeping

### 🔄 Refresh Data
- Click **Refresh** to reload the latest orders
- Automatic updates every 30 seconds

---

## Security Best Practices

### Before Going Live:
1. ✅ Change default admin credentials in `.env`
2. ✅ Use a strong password (mix of letters, numbers, symbols)
3. ✅ Set `NODE_ENV=production`
4. ✅ Keep `.env` file secure and don't share it

### For Production Hosting:
1. Add HTTPS/SSL certificate
2. Use environment variables (not hardcoded)
3. Consider 2FA (two-factor authentication)
4. Regular backups of your database
5. Monitor access logs

---

## Troubleshooting

### "Cannot login" error
- Check your username/password spelling
- Ensure `.env` file is in the correct location
- Make sure server was restarted after creating `.env`
- Check browser console for error messages

### "Admin dashboard won't load"
- Verify server is running: `node server.js`
- Clear browser cache (Ctrl+Shift+Delete)
- Try private/incognito window
- Check if port 3000 is accessible

### Lost your password?
- Edit the `.env` file with a new password
- Restart the server
- Login with new credentials

---

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Admin Dashboard | `/admin.html` | Login & manage orders |
| Environment Config | `.env` | Store sensitive credentials |
| Server Code | `server.js` | Backend that handles admin auth |
| Database | `data/orders.db` | Stores all orders |

---

## Browser Persistence

The admin dashboard remembers your login:
- Session stored in browser localStorage
- Automatically logs out after closing browser
- Click **Logout** to manually sign out

---

## API Endpoints (For Advanced Users)

All endpoints require Basic Auth with your admin credentials:

```
GET  /api/admin/orders          → List all orders
POST /api/admin/orders/:id/mark-paid → Mark order as paid
GET  /api/admin/analytics       → Get sales statistics
GET  /api/admin/orders/export/csv → Download CSV export
```

**Example (using curl):**
```bash
curl -u admin:password http://localhost:3000/api/admin/orders
```

---

## Next Steps

1. ✅ Set your custom admin credentials in `.env`
2. ✅ Login to admin dashboard at `/admin.html`
3. ✅ Test creating an order and checking it in admin
4. ✅ Export CSV to verify data export works
5. ✅ Review the deployment guide for going live

See **DEPLOYMENT.md** for hosting instructions.
