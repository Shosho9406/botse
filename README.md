# Botse by Masego — Handmade E-Commerce Platform

A full-featured e-commerce platform for Botse by Masego, showcasing handmade slouchy beanies and scrunchies. Built with Express.js backend and SQLite database for order management.

## � Deployment Guides

Choose your deployment strategy:

- **[Vercel + Lambda + API Gateway](./DEPLOYMENT_LAMBDA_GATEWAY.md)** ⭐ **RECOMMENDED** - $0-5/month, serverless, zero downtime
- [Vercel + Elastic Beanstalk](./DEPLOYMENT_VERCEL_AWS.md) - $10-30/month, managed VMs

## �🚀 Quick Start with PM2 (Windows PowerShell)

PM2 automatically restarts the server if it crashes and provides reliable process management.

```powershell
cd "C:/Users/User/Desktop/Botse by Masego"
npm install
npm start
# Server runs on http://localhost:3000 with PM2 process manager
```

### Useful PM2 Commands

```powershell
npm run logs          # View real-time server logs
npm run restart       # Restart the server
npm stop              # Stop the server
npm run dev           # Run in development mode (without PM2, with auto-reload)
```

## 📁 Project Structure

```
├── server.js              # Express server with API endpoints
├── db.js                  # SQLite database management
├── package.json           # Dependencies & scripts
├── .env.example           # Environment configuration template
├── data/                  # Orders database (orders.db)
├── public/
│   ├── index.html         # Home page with product showcase
│   ├── products.html      # Product listing & details
│   ├── order.html         # Order placement form
│   ├── payment.html       # Payment & deposit information
│   ├── admin.html         # Admin dashboard
│   ├── admin.js           # Admin functionality
│   ├── app.js             # Frontend order & payment handling
│   └── images/            # Product images folder
└── test/
    └── test_order.js      # Sample order test script
```

## 🌐 Pages

### Customer Pages
- **Home** (`/`) — Product showcase and order CTA
- **Products** (`/products.html`) — Browse all products with pricing
- **Order** (`/order.html`) — Place orders with real-time price calculation
- **Payment** (`/payment.html?orderId=ID`) — View deposit amount and payment methods

### Admin Pages
- **Admin Dashboard** (`/admin.html`) — Manage orders, search, export, and mark as paid

## 🔌 API Endpoints

### Public
- `GET /api/products` — List all products
- `POST /api/orders` — Create new order
- `GET /api/orders/:id` — Get order details (by ID from URL)

### Admin (requires Basic Auth)
- `GET /api/admin/orders` — List all orders (with search & filter)
- `POST /api/orders/:id/pay` — Mark order as paid
- `GET /api/admin/orders/export/csv` — Export orders to CSV
- `GET /api/admin/analytics` — Get sales analytics

### Webhooks
- `POST /api/payments/webhook` — Payment provider webhook (placeholder)

## 💰 Order & Payment Flow

1. **Customer places order** → Real-time price calculation → 50% deposit calculated
2. **Order confirmed** → Redirects to payment page with deposit amount
3. **Payment methods** → Bank transfer or WhatsApp contact
4. **Admin marks paid** → Via admin dashboard after proof received
5. **Production starts** → Order status updated, customer notified

## 🔐 Security & Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
ADMIN_USER=admin        # Change this!
ADMIN_PASS=password     # Change this!
```

### Admin Credentials
- Default: `admin` / `password`
- **IMPORTANT:** Change before production deployment
- Set via environment variables: `ADMIN_USER`, `ADMIN_PASS`

## 📊 Features

✅ **Product Management**
- 3 slouchy beanie styles with multiple colour options
- 3 scrunchie sizes with extra colour pricing
- Real-time price calculation
- Customization support

✅ **Order Management**
- Complete order form with validation
- Automatic 50% deposit calculation
- Order tracking with status (pending, paid, completed)
- Customer contact preservation

✅ **Admin Dashboard**
- View all orders in table format
- Search orders by ID, name, phone, or product
- Filter by status (pending, paid, completed)
- Mark orders as paid
- Export orders to CSV
- Sales analytics (total orders, revenue, paid/pending)

✅ **User Experience**
- Mobile-responsive design
- Real-time form validation
- Clear payment instructions
- WhatsApp integration for easy contact
- Professional styling with pink/beige theme

## 📝 Database Schema

Orders table includes:
- ID, Product ID/Name, Variant, Quantity
- Unit Price, Total, Deposit Amount
- Customer: Name, Phone, Address
- Order metadata: Status, Payment received, Created date
- Notes/special requests

## 🧪 Testing

Run sample order creation:
```powershell
npm test
```

This will POST a test order to the API and display the response.

## 🚢 Deployment

### Ready for Production
- ✅ Input validation & sanitization
- ✅ Error handling & logging
- ✅ Environment-based configuration
- ✅ SQLite database (can be upgraded to PostgreSQL)
- ✅ Admin authentication

### Next Steps for Production
1. Change admin credentials
2. Set `NODE_ENV=production`
3. Add HTTPS certificate
4. Deploy to hosting (Heroku, Render, Railway, DigitalOcean, AWS)
5. Optional: Email notifications, advanced payment integration

### Deployment Platforms
- **Heroku** — `git push heroku main`
- **Render** — Connect GitHub repo, auto-deploy
- **Railway** — Push code, auto-detect Node.js
- **VPS** — Use PM2 for process management

## 📧 Support & Customization

Add features:
- Email notifications on order placed/paid
- Payment gateway integration (PayFast, Stripe, Square)
- Image gallery for products
- Customer account system
- Order tracking timeline

## 📄 License

MIT
