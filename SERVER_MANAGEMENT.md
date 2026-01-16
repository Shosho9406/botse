# Server Management Guide

## Quick Start

### Option 1: Batch File (Easiest for Windows)
1. Double-click `START_SERVER.bat` in your project folder
2. Server will start automatically
3. It will automatically clean up any old processes

### Option 2: PowerShell Script
1. Open PowerShell in the project folder
2. Run: `powershell -ExecutionPolicy Bypass -File start-server.ps1`
3. Server starts with automatic cleanup

### Option 3: Command Line (Manual)
```powershell
cd "c:\Users\User\Desktop\Botse by Masego"
node server.js
```

---

## Why Server Stops

The server stops when:
- ❌ You press `Ctrl+C` in the terminal
- ❌ The terminal window closes
- ❌ Your computer goes to sleep
- ❌ The Node.js process crashes
- ❌ Port 3000 is already in use by another process

---

## How to Keep Server Running

### Solution 1: Use PM2 (Recommended for Production)
PM2 keeps your server running 24/7 and auto-restarts on crashes.

**Install PM2:**
```powershell
npm install -g pm2
```

**Start server with PM2:**
```powershell
pm2 start server.js --name "botse"
```

**View running processes:**
```powershell
pm2 list
```

**Stop server:**
```powershell
pm2 stop botse
```

**View logs:**
```powershell
pm2 logs botse
```

**Auto-start on system reboot:**
```powershell
pm2 startup
pm2 save
```

---

### Solution 2: Keep Terminal Window Open
- Use `START_SERVER.bat` to start server
- Keep the terminal window open
- Don't close it while working on the site

---

### Solution 3: Check Port in Use
If you get "Address already in use" error:

```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill the process (replace PID with actual number)
Stop-Process -Id PID -Force
```

Or use the batch/PowerShell script which does this automatically.

---

## Accessing Your Site When Server Is Running

Once the server shows:
```
[INFO] Server running in production mode on http://localhost:3000
```

✅ **Home page**: http://localhost:3000
✅ **Admin**: http://localhost:3000/admin.html
✅ **Orders**: http://localhost:3000/order.html
✅ **Products**: http://localhost:3000/products.html
✅ **Payment**: http://localhost:3000/payment.html

---

## Troubleshooting

### Server won't start
1. Make sure Node.js is installed: `node --version`
2. Check port 3000 isn't in use: `Get-NetTCPConnection -LocalPort 3000`
3. Kill old process: `Stop-Process -Id PID -Force`
4. Try again

### "Cannot find module" error
1. Install dependencies: `npm install`
2. Restart server: `node server.js`

### "Address already in use" error
Port 3000 is being used by another process:
```powershell
# Option A: Use automatic cleanup
# Run START_SERVER.bat or start-server.ps1

# Option B: Manual cleanup
Get-Process node | Stop-Process -Force
```

### Server crashes
Check the error message in the terminal. If it keeps crashing:
1. Check `server.js` for syntax errors
2. Verify database file exists in `data/` folder
3. Check .env file has correct settings
4. Reinstall dependencies: `npm install`

---

## Testing Server is Running

```powershell
# Test from PowerShell
Invoke-WebRequest http://localhost:3000 -ErrorAction Ignore

# If successful, you'll get status 200
# If failed, you'll get a connection error
```

---

## For Development vs Production

### Development (Local Testing)
- Use `START_SERVER.bat` for quick starts
- Server runs in development mode
- Logs all requests
- Can use hot-reload if needed

### Production (Going Live)
- Use PM2 to keep server running 24/7
- Set `NODE_ENV=production` in .env
- Change admin password to something strong
- Use HTTPS/SSL certificate
- Set up regular backups
- Monitor logs for errors

---

## Files Related to Server

- `server.js` - Main server code
- `db.js` - Database operations
- `.env` - Environment configuration
- `package.json` - Dependencies
- `START_SERVER.bat` - Easy batch starter
- `start-server.ps1` - PowerShell starter
- `data/orders.db` - SQLite database

---

## Need Help?

If server keeps stopping:
1. Use PM2 for automatic restarts
2. Check logs: `pm2 logs botse`
3. Verify .env file exists
4. Ensure port 3000 is free
5. Check Node.js version is compatible

**Recommended: Use PM2 for worry-free server management!**
