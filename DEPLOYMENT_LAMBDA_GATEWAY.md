# Deployment Guide: Vercel + AWS Lambda + API Gateway

This guide deploys your Botse application with ultra-low cost and zero server management:
- **Frontend**: Vercel (static hosting + CDN)
- **Backend API**: AWS Lambda + API Gateway (serverless)
- **Database**: DynamoDB or RDS (optional - SQLite also works)

## Architecture Overview

```
GitHub Repository
    ├─ Frontend (/public) → Vercel (https://botse.vercel.app)
    └─ Backend API (/lambda) → API Gateway + Lambda (https://api.botse.example.com)
```

---

## Pricing Comparison

### Free Tier (First 12 Months)
- **API Gateway**: 1 million requests/month (then $3.50/million)
- **Lambda**: 1 million invocations/month, 400,000 GB-seconds (then $0.20/million + $0.0000166667/GB-second)
- **DynamoDB**: 25GB storage, 25 units read/write (then $1.25 per unit)
- **Vercel**: Free with pro features

**Total Cost**: $0/month (within free tier)

---

## Part 1: Deploy Frontend to Vercel (Same as Before)

### Quick Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your `botse` repository
4. Set Root Directory to `./public`
5. Deploy

---

## Part 2: Deploy Backend to Lambda + API Gateway

### Option A: Using AWS Lambda Web Adapter (Recommended - Easier)

This allows your Express server to run on Lambda with minimal changes.

#### Step 1: Install Lambda Web Adapter
```powershell
cd "c:\Users\User\Desktop\Botse by Masego"
npm install aws-lambda-web-adapter
```

#### Step 2: Create Lambda Handler File
Create `lambda.js`:

```javascript
const awsLambdaFastify = require('aws-lambda-web-adapter');
const app = require('./server');

exports.handler = awsLambdaFastify(app);
```

Or use the provided `lambda-handler.js` in the repo.

#### Step 3: Create Deployment Package
```powershell
# Install dependencies
npm install --production

# Create ZIP file
Compress-Archive -Path .\node_modules, .\server.js, .\db.js, .\public, .\data -DestinationPath lambda-function.zip
```

#### Step 4: Create Lambda Function in AWS Console
1. Go to AWS Lambda Console
2. Click "Create function"
3. Choose "Author from scratch"
   - Function name: `botse-api`
   - Runtime: `Node.js 18.x`
   - Architecture: `x86_64`
4. Click "Create function"

#### Step 5: Upload Code
1. In Function code section, click "Upload from"
2. Choose ".zip file"
3. Upload `lambda-function.zip`
4. Set Handler: `lambda.handler`

#### Step 6: Configure Environment Variables
In Lambda Console:
1. Go to Configuration → Environment variables
2. Add:
   ```
   NODE_ENV = production
   ADMIN_USER = your_username
   ADMIN_PASS = your_secure_password
   ```
3. Click "Save"

#### Step 7: Create API Gateway
1. Go to AWS API Gateway Console
2. Click "Create API"
3. Choose "REST API" → "Build"
4. API name: `botse-api`
5. Create

#### Step 8: Create Resource and Method
1. Click "Create Resource"
2. Resource name: `{proxy+}` (catch all routes)
3. Check "Enable API Gateway CORS"
4. Create
5. Click on `{proxy+}` → "Create Method" → "ANY"
6. Integration type: "Lambda Function"
7. Lambda Function: `botse-api`
8. Click "Save"

#### Step 9: Deploy API
1. Click "Deploy API"
2. Deployment stage: `prod`
3. Click "Deploy"
4. Note your **Invoke URL** (e.g., `https://xxxxx.execute-api.us-east-1.amazonaws.com/prod`)

---

### Option B: Refactor for Pure Lambda Functions (Advanced)

If you want to optimize further, break into individual Lambda functions:

```
GET /api/products → products-lambda.js
POST /api/orders → create-order-lambda.js
GET /api/orders/{id} → get-order-lambda.js
POST /api/orders/{id}/pay → pay-order-lambda.js
GET /api/admin/analytics → analytics-lambda.js
GET /api/admin/orders → admin-orders-lambda.js
```

*(See `lambda-refactored/` folder for example)*

---

## Part 3: Update Frontend API Configuration

Edit `public/api-config.js`:

```javascript
const API_BASE_URL = (() => {
  // Production: Use your API Gateway URL
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://xxxxx.execute-api.us-east-1.amazonaws.com/prod'; // Replace with your API Gateway URL
  }
  // Development: Use local backend
  return 'http://localhost:3000';
})();
```

---

## Part 4: Database Options

### Option 1: SQLite (Current - Works Fine)
- Pros: No setup needed, data persists
- Cons: Stored in Lambda ephemeral storage (gets recreated)
- Use for: Development/testing only

**Recommendation**: Use only for MVP testing

### Option 2: DynamoDB (Recommended for Lambda)
- Pros: Serverless, scales automatically, free tier generous
- Cons: Different data model, slight refactoring needed

**Cost**: Free tier covers most users
**Setup**: See DynamoDB section below

### Option 3: RDS (MySQL/PostgreSQL)
- Pros: Familiar SQL, good for complex queries
- Cons: Costs more than DynamoDB, needs configuration

**Cost**: ~$15/month minimum
**Recommendation**: For production when traffic increases

---

## DynamoDB Setup (Recommended)

### Create Table
1. Go to AWS DynamoDB Console
2. Click "Create table"
3. Table name: `botse-orders`
4. Partition key: `id` (String)
5. Sort key: (none)
6. Billing mode: "Pay per request" (auto-scales)
7. Create table

### Update Code
Replace database calls with DynamoDB SDK:

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Instead of: db.run(INSERT INTO orders...)
await dynamodb.put({
  TableName: 'botse-orders',
  Item: {
    id: uuid(),
    productId, productName, variant, quantity, unitPrice, total,
    name, phone, address, notes, createdAt, status, paymentReceived, depositAmount
  }
}).promise();
```

---

## Monitoring & Logs

### View Lambda Logs
```powershell
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure

# View logs
aws logs tail /aws/lambda/botse-api --follow

# Or use CloudWatch Console:
# Go to CloudWatch → Log Groups → /aws/lambda/botse-api
```

### Monitor Costs
1. Go to AWS Billing Console
2. Set up billing alerts
3. Free tier usage tracker shows remaining free requests

---

## Useful AWS CLI Commands

```powershell
# Update Lambda code
aws lambda update-function-code `
  --function-name botse-api `
  --zip-file fileb://lambda-function.zip

# View function metrics
aws cloudwatch get-metric-statistics `
  --namespace AWS/Lambda `
  --metric-name Invocations `
  --dimensions Name=FunctionName,Value=botse-api `
  --start-time 2024-01-01T00:00:00Z `
  --end-time 2024-01-02T00:00:00Z `
  --period 3600 `
  --statistics Sum

# Set environment variables
aws lambda update-function-configuration `
  --function-name botse-api `
  --environment Variables={NODE_ENV=production,ADMIN_USER=admin}
```

---

## Troubleshooting

### Lambda Timeout
Default is 3 seconds - increase to 30s:
1. Lambda Console → Configuration → General configuration
2. Timeout: 30 seconds
3. Memory: 512 MB

### Cold Start Issues
- First request takes 1-5 seconds (Lambda initialization)
- Solution: Use Lambda SnapStart (Java/Ruby only) or accept it
- Solution: Use CloudWatch scheduled events to keep warm

### CORS Errors
Ensure API Gateway has CORS enabled:
1. API Gateway Console → Resources
2. Select `{proxy+}`
3. Enable CORS
4. Redeploy API

### Database Connection Issues
- SQLite: Data persists in EBS only
- DynamoDB: Ensure Lambda has IAM role with DynamoDB permissions
- RDS: Ensure security groups allow inbound traffic from Lambda

---

## Deployment Checklist

- [ ] Vercel frontend deployed
- [ ] Lambda function created
- [ ] API Gateway configured
- [ ] API Gateway URL noted
- [ ] `api-config.js` updated with Gateway URL
- [ ] Environment variables set in Lambda
- [ ] CORS enabled in API Gateway
- [ ] Database selected (SQLite/DynamoDB/RDS)
- [ ] Tested frontend → backend connection
- [ ] Billing alerts set up

---

## Cost Breakdown (First 12 Months)

```
API Gateway:      $0 (first 1M requests)
Lambda:           $0 (first 1M invocations)
DynamoDB:         $0 (within free tier)
Vercel:           $0 (free plan)
RDS (optional):   $0 (free tier) or $15+/month
─────────────────────────────────
TOTAL:            $0/month (within free tier)
```

After free tier:
```
API Gateway:      ~$3.50 per million requests
Lambda:           ~$0.20 per million invocations
DynamoDB:         ~$1.25 per unit (read/write)
Vercel:           ~$20/month (pro)
─────────────────────────────────
TOTAL:            ~$30-50/month (at scale)
```

---

## Next Steps

1. ✅ Code is ready for Lambda deployment
2. Create AWS Lambda function
3. Create API Gateway
4. Update API URL in frontend
5. Test end-to-end
6. Monitor first few days

---

## Helpful Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS Lambda Web Adapter](https://github.com/aws/aws-lambda-web-adapter)

Questions? Feel free to ask!
