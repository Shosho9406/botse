# Deployment Guide - Botse by Masego

## 🚀 Deploy to Production

Your Botse by Masego site is ready for production deployment! Choose your hosting platform below.

## 1️⃣ Heroku Deployment (Easiest)

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git installed

### Steps

```powershell
# Login to Heroku
heroku login

# Create new Heroku app
heroku create botse-by-masego

# Set environment variables
heroku config:set ADMIN_USER=your_username
heroku config:set ADMIN_PASS=your_secure_password
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### After Deployment
- Visit: `https://botse-by-masego.herokuapp.com`
- Admin: `https://botse-by-masego.herokuapp.com/admin.html`

### Notes
- Free tier has limitations (sleeps after 30 mins of inactivity)
- Upgrade to paid plans for always-on hosting
- Database persists between deployments

---

## 2️⃣ Render Deployment (Recommended)

### Prerequisites
- Render account (free tier available)
- GitHub account
- Your project pushed to GitHub

### Steps

1. **Push to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Name: `botse-by-masego`
   - Build command: `npm install`
   - Start command: `node server.js`

3. **Set Environment Variables**
   - In Render dashboard:
   - Add: `ADMIN_USER=your_username`
   - Add: `ADMIN_PASS=your_secure_password`
   - Add: `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

### After Deployment
- Visit auto-generated URL from Render
- Enable auto-deploy on GitHub push

---

## 3️⃣ Railway Deployment

### Prerequisites
- Railway account (free credits)
- GitHub connected

### Steps

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "Start New Project"
   - Select "Deploy from GitHub"
   - Choose your repo

2. **Configure**
   - Railway auto-detects Node.js
   - Add variables:
     - `ADMIN_USER` = your_username
     - `ADMIN_PASS` = your_secure_password
     - `NODE_ENV` = production

3. **Deploy**
   - Click "Deploy"
   - View logs in dashboard

---

## 4️⃣ DigitalOcean App Platform

### Prerequisites
- DigitalOcean account
- Billing info on file

### Steps

1. **Create App**
   - Click "Create" → "Apps"
   - Connect GitHub
   - Select `botse-by-masego` repo

2. **Configure**
   - Auto-detects Node.js app
   - Set environment variables in dashboard

3. **Deploy**
   - Click "Create Resources"
   - Wait for deployment
   - Get your live URL

### Cost
- Free tier: $5/month base
- Database: $15/month (if upgrading from SQLite)

---

## 5️⃣ AWS (EC2/Elastic Beanstalk)

### For Serious Scale
If expecting high traffic:

1. **Create EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)

2. **SSH and Setup**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   git clone your-repo
   cd botse-by-masego
   npm install
   npm start
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "botse"
   pm2 startup
   pm2 save
   ```

4. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   # Configure nginx to forward to localhost:3000
   ```

5. **Get HTTPS Certificate**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 6️⃣ VPS with PM2 (Any Provider)

Works with: Linode, Vultr, Hetzner, DigitalOcean droplets, etc.

### Setup Steps

```bash
# Login to VPS
ssh root@your_ip

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Install PM2 globally
npm install -g pm2

# Clone your repository
git clone https://github.com/yourname/botse-by-masego.git
cd botse-by-masego

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name "botse"
pm2 startup
pm2 save

# Setup Nginx (optional but recommended)
sudo apt install nginx
# Edit /etc/nginx/sites-available/default
# Proxy to localhost:3000

# Get SSL Certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Security Checklist

Before deploying to production:

- [ ] Change admin username and password
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (SSL certificate)
- [ ] Update database backups strategy
- [ ] Set up monitoring/logging
- [ ] Configure firewall rules
- [ ] Disable debug mode
- [ ] Review all environment variables
- [ ] Test payment flow end-to-end
- [ ] Set up email notifications (optional)

## Environment Variables Template

Create `.env` file with:

```env
# Server
PORT=3000
NODE_ENV=production

# Admin Credentials (CHANGE THESE!)
ADMIN_USER=your_secure_username
ADMIN_PASS=your_secure_long_password

# Database (if upgrading)
DATABASE_URL=postgresql://user:password@host/db

# Optional: Email Integration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password

# Optional: Payment Gateway
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
```

## Database Backup

### SQLite (Current)
```bash
# Backup
cp data/orders.db data/orders.backup.db

# Restore
cp data/orders.backup.db data/orders.db
```

### Upgrade to PostgreSQL (Optional)

For high-traffic sites, upgrade database:

1. **Create PostgreSQL database** at:
   - Heroku Postgres
   - AWS RDS
   - DigitalOcean Managed DB
   - ElephantSQL (free tier)

2. **Update connection string** in `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@host/db
   ```

3. **Migrate data** (manual or automated script)

## Monitoring & Logging

### Free Options
- **Heroku**: Built-in logs
- **Render**: Built-in logs
- **Railway**: Built-in logs

### Paid Options
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: Full monitoring
- **New Relic**: APM monitoring

## Performance Optimization

Before production:

1. **Enable Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Cache Static Files**
   ```javascript
   app.use(express.static('public', {
     maxAge: '1d',
     etag: false
   }));
   ```

3. **Database Indexing**
   ```sql
   CREATE INDEX idx_phone ON orders(phone);
   CREATE INDEX idx_status ON orders(status);
   ```

4. **CDN for Static Assets**
   - Use Cloudflare, CloudFront, or Bunny CDN
   - Point domain to CDN
   - Serve images from CDN

## Domain Setup

1. **Buy domain** from:
   - Namecheap
   - GoDaddy
   - Route53
   - Your hosting provider

2. **Point DNS to hosting**
   - Heroku: Add DNS CNAME record
   - Render: Point nameservers
   - DigitalOcean: Use their nameservers

3. **Setup SSL Certificate**
   - Most platforms provide free Let's Encrypt
   - Use Cloudflare for free SSL + caching

## Example: Cloudflare Setup

1. Change nameservers to Cloudflare
2. Create DNS records pointing to your hosting
3. Enable "Full SSL" mode
4. Setup cache rules
5. Enable WAF (firewall)

---

## Cost Comparison

| Platform | Cost | Pros | Cons |
|----------|------|------|------|
| Heroku | $7+/mo | Easy, reliable | Can be expensive |
| Render | $7+/mo | Modern, GitHub integration | Smaller community |
| Railway | Free credits | Good for startups | Credits run out |
| DigitalOcean | $5+/mo | Affordable, scalable | More setup required |
| AWS Free Tier | Free for 12mo | Scalable, powerful | Complex setup |
| VPS (Linode) | $5+/mo | Full control | Requires sysadmin |

---

## Monitoring Your Live Site

### Essential Checks
- [ ] Server responds in <2s
- [ ] Admin dashboard loads
- [ ] Orders save to database
- [ ] Payment page displays correctly
- [ ] WhatsApp links work
- [ ] CSV export functions

### Set Reminders
- Daily: Check recent orders
- Weekly: Review sales stats
- Monthly: Backup database
- Quarterly: Update dependencies

---

## Scaling as You Grow

### Phase 1: 0-100 orders/month
- Current setup works fine
- Monitor logs
- Manual backups sufficient

### Phase 2: 100-1000 orders/month
- Consider upgrading database
- Add caching (Redis)
- Setup monitoring tools
- Automated backups

### Phase 3: 1000+ orders/month
- Load balancer
- PostgreSQL with replication
- Redis for sessions
- CDN for static assets
- Email notifications
- Advanced analytics

---

## Support & Troubleshooting

### Deployment Issues
1. Check build logs in hosting platform
2. Verify environment variables set
3. Ensure Node.js version compatible
4. Check package.json scripts

### Runtime Issues
1. Check logs in hosting dashboard
2. SSH into server to debug
3. Verify database connection
4. Check disk space

### Help Resources
- Render Docs: https://render.com/docs
- Heroku Docs: https://devcenter.heroku.com
- Railway Docs: https://docs.railway.app
- Node.js Best Practices: https://nodejs.org/en/docs/

---

## Next Steps

1. ✅ Test locally (done!)
2. ⬜ Choose hosting platform
3. ⬜ Set up domain (optional)
4. ⬜ Deploy application
5. ⬜ Test payment flow live
6. ⬜ Monitor and optimize

**You're ready to go live!** 🚀
