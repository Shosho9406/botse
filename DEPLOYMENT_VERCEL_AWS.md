# Deployment Guide: Vercel + AWS Elastic Beanstalk

This guide will help you deploy your Botse application across two platforms:
- **Frontend**: Vercel (static hosting + CDN)
- **Backend API**: AWS Elastic Beanstalk (Node.js server)

## Architecture Overview

```
GitHub Repository
    ├─ Frontend (/public) → Vercel (https://botse.vercel.app)
    └─ Backend (/server.js) → AWS Elastic Beanstalk (https://botse-env.elasticbeanstalk.com)
```

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (easiest method)
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Repository
1. In Vercel dashboard, click "New Project"
2. Select your `botse` repository
3. Configure project settings:
   - **Framework Preset**: Other (static)
   - **Root Directory**: `./public`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
4. Click "Deploy"

### Step 3: Update API URL
After Vercel deployment, note your frontend URL (e.g., `https://botse.vercel.app`)

Once you deploy your AWS backend, you'll update the API endpoint in `public/api-config.js`:

```javascript
return 'https://your-aws-elasticbeanstalk-url.com'; // Replace with actual AWS URL
```

---

## Part 2: Deploy Backend to AWS Elastic Beanstalk

### Step 1: Create AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Sign up for free tier account
3. Verify email and payment method

### Step 2: Install EB CLI
```powershell
# On Windows PowerShell
pip install awsebcli --upgrade --user
```

### Step 3: Configure AWS Credentials
```powershell
aws configure
# Enter:
# AWS Access Key ID: [from AWS IAM]
# AWS Secret Access Key: [from AWS IAM]
# Default region: us-east-1
# Default output format: json
```

### Step 4: Initialize Elastic Beanstalk
```powershell
cd "c:\Users\User\Desktop\Botse by Masego"
eb init -p node.js-18 botse-api --region us-east-1
```

### Step 5: Create Environment
```powershell
eb create botse-env
# This will take 5-10 minutes to create the instance
```

### Step 6: Deploy Your Code
```powershell
git push
eb deploy
```

### Step 7: View Your Application
```powershell
eb open
# Or check AWS Console for your environment URL
# Typically: http://botse-env.elasticbeanstalk.com
```

---

## Step 3: Connect Frontend to Backend

### Option A: Update Configuration (Recommended)
Edit `public/api-config.js`:

```javascript
const API_BASE_URL = (() => {
  // Production: Use your AWS backend URL
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://botse-env.elasticbeanstalk.com'; // Replace with actual AWS URL
  }
  // Development: Use local backend
  return 'http://localhost:3000';
})();
```

### Option B: Enable CORS on AWS
If frontend and backend are on different domains, ensure CORS is enabled in `server.js` (already configured):

```javascript
app.use(cors());
```

---

## Environment Variables

### For Local Development
Create `.env` file in project root:
```
PORT=3000
NODE_ENV=development
ADMIN_USER=admin
ADMIN_PASS=your_secure_password
```

### For AWS Elastic Beanstalk
Set environment variables in AWS Console:

1. Go to AWS Elastic Beanstalk Console
2. Select your environment (botse-env)
3. Click "Configuration"
4. Under "Software", click "Edit"
5. Add environment properties:
   ```
   ADMIN_USER = your_username
   ADMIN_PASS = your_secure_password
   NODE_ENV = production
   ```
6. Click "Apply"

---

## Useful Commands

### Vercel
```bash
# View deployment logs
vercel logs

# Redeploy
vercel --prod
```

### AWS Elastic Beanstalk
```powershell
# View logs
eb logs

# SSH into instance
eb ssh

# Monitor health
eb health

# Scale up/down
eb scale 2  # 2 instances

# Terminate environment
eb terminate botse-env

# Update environment
eb deploy
```

---

## Troubleshooting

### Frontend not connecting to backend
1. Check CORS is enabled in `server.js`
2. Update API URL in `public/api-config.js`
3. Check AWS security group allows port 80, 443, 3000

### AWS Deployment Fails
```powershell
# Check logs
eb logs

# Check if dependencies installed
eb ssh
npm install
```

### Database Issues
SQLite database is stored at `/data/orders.db`. After deployment:
- First load creates database automatically
- Backup data regularly: `eb ssh` then copy the database

---

## Monitoring & Maintenance

### Vercel
- Auto-deploys on git push to main
- Free SSL/TLS certificates
- CDN automatically serves static files

### AWS Elastic Beanstalk
- Monitor CPU, memory, network
- Set up CloudWatch alarms
- Regular backups recommended
- Use AWS RDS for production database

---

## Cost Estimate (Free Tier)

- **Vercel**: Free (up to 100GB bandwidth/month)
- **AWS Elastic Beanstalk**: Free (750 hours/month for t2.micro)
- **Total**: $0/month (within free tier limits)

⚠️ After free tier expires:
- Vercel: ~$20/month for professional plans
- AWS: ~$10-30/month depending on usage

---

## Next Steps

1. ✅ Push latest code to GitHub
2. ✅ Deploy frontend to Vercel
3. ✅ Deploy backend to AWS
4. ✅ Update API URL in frontend config
5. ✅ Test both environments

Questions? Check AWS & Vercel documentation or community forums.
