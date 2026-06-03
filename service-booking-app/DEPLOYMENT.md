# Service Booking Platform - Backend Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Razorpay account
- Heroku/Vercel account (for deployment)

## Environment Setup

### 1. Create .env file
```bash
cp .env.example .env
```

### 2. Configure Environment Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/service-booking
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

FRONTEND_URL=https://your-frontend-domain.com
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Sample Data
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## MongoDB Setup

### Create Database on MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add your IP to whitelist
4. Create database user
5. Get connection string and add to .env

### Collections
- users
- services
- bookings
- reviews
- payments

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update profile

### Services
- POST `/api/services` - Create service (Provider)
- GET `/api/services/provider/:providerId` - Get provider services
- GET `/api/services/category/:category` - Get services by category
- GET `/api/services/search` - Search services
- GET `/api/services/:serviceId` - Get service details
- PUT `/api/services/:serviceId` - Update service
- DELETE `/api/services/:serviceId` - Delete service

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my-bookings` - Get customer bookings
- GET `/api/bookings/provider-bookings` - Get provider bookings
- GET `/api/bookings/:bookingId` - Get booking details
- PUT `/api/bookings/:bookingId/status` - Update booking status
- PUT `/api/bookings/:bookingId/cancel` - Cancel booking

### Reviews
- POST `/api/reviews` - Create review
- GET `/api/reviews/service/:serviceId` - Get service reviews
- GET `/api/reviews/provider/:providerId` - Get provider reviews
- PUT `/api/reviews/:reviewId` - Update review
- DELETE `/api/reviews/:reviewId` - Delete review

### Payments
- POST `/api/payments/initialize` - Initialize payment
- POST `/api/payments/verify` - Verify payment
- GET `/api/payments/:paymentId` - Get payment details
- POST `/api/payments/:paymentId/refund` - Refund payment

### Admin
- GET `/api/admin/dashboard/stats` - Dashboard statistics
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/:userId/verify` - Verify provider
- PUT `/api/admin/users/:userId/suspend` - Suspend user
- PUT `/api/admin/users/:userId/reactivate` - Reactivate user
- GET `/api/admin/bookings` - Get all bookings
- GET `/api/admin/reviews/flagged` - Get flagged reviews
- GET `/api/admin/payments/stats` - Payment statistics

## Deployment to Heroku

### 1. Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
heroku create your-app-name
```

### 4. Set Environment Variables
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set RAZORPAY_KEY_ID=your_razorpay_key
heroku config:set RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 5. Deploy
```bash
git push heroku main
```

### 6. View Logs
```bash
heroku logs --tail
```

## Deployment to AWS (EC2)

### 1. Launch EC2 Instance
- Choose Ubuntu 20.04 LTS
- Configure security groups to allow port 5000
- Create key pair for SSH access

### 2. Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 3. Install Node.js and MongoDB
```bash
# Update system
sudo apt update
sudo apt upgrade

# Install Node.js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org
```

### 4. Clone Repository
```bash
git clone your-repo-url
cd service-booking-app/backend
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Create .env file
```bash
sudo nano .env
# Add all environment variables
```

### 7. Run with PM2
```bash
npm install -g pm2
pm2 start src/server.js --name "service-booking"
pm2 startup
pm2 save
```

### 8. Configure Nginx
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add proxy configuration:
```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
```

### 9. Restart Nginx
```bash
sudo systemctl restart nginx
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### Build and Run
```bash
docker build -t service-booking-backend .
docker run -p 5000:5000 --env-file .env service-booking-backend
```

## Monitoring and Maintenance

### View Logs
```bash
# Development
npm run dev

# Heroku
heroku logs --tail

# PM2
pm2 logs
```

### Database Maintenance
```bash
# Backup MongoDB
mongodump --uri "your_mongodb_uri" --out ./backup

# Restore MongoDB
mongorestore --uri "your_mongodb_uri" ./backup
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Troubleshooting

### Port already in use
```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection error
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Check network connectivity

### CORS errors
- Ensure FRONTEND_URL is correctly set in .env
- Check CORS configuration in server.js

### Payment integration issues
- Verify Razorpay API keys
- Check webhook configuration
- Test in sandbox mode first
