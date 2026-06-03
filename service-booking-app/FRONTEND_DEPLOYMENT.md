# Service Booking Platform - Frontend Deployment Guide

## Environment Setup

### 1. Create .env.local file
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Install Dependencies
```bash
npm install
```

## Development

### Start Development Server
```bash
npm start
```

App will run on `http://localhost:3000`

## Production Build

### Create Optimized Build
```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Deployment Options

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
vercel
```

#### 3. Environment Variables
Set in Vercel dashboard:
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_RAZORPAY_KEY_ID` - Razorpay Key

### Option 2: Netlify

#### 1. Connect Repository
- Go to https://netlify.com
- Connect your GitHub repository
- Select build command: `npm run build`
- Select publish directory: `build`

#### 2. Environment Variables
Add in Netlify settings:
- `REACT_APP_API_URL`
- `REACT_APP_RAZORPAY_KEY_ID`

### Option 3: AWS S3 + CloudFront

#### 1. Build Project
```bash
npm run build
```

#### 2. Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name --region us-east-1
```

#### 3. Upload Files
```bash
aws s3 sync build/ s3://your-bucket-name
```

#### 4. Create CloudFront Distribution
- Set S3 bucket as origin
- Configure cache settings
- Set default root object to `index.html`

### Option 4: Docker

#### Dockerfile.multi-stage
```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and Run
```bash
docker build -t service-booking-frontend .
docker run -p 80:80 service-booking-frontend
```

## GitHub Pages Deployment

### 1. Update package.json
```json
{
  "homepage": "https://yourusername.github.io/repo-name"
}
```

### 2. Install gh-pages
```bash
npm install --save-dev gh-pages
```

### 3. Add Deploy Scripts
```json
{
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

### 4. Deploy
```bash
npm run deploy
```

## Performance Optimization

### 1. Code Splitting
```javascript
import React, { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));

<Suspense fallback={<div>Loading...</div>}>
  <Home />
</Suspense>
```

### 2. Lazy Load Images
```javascript
<img loading="lazy" src="image.jpg" alt="description" />
```

### 3. Optimize Bundle
```bash
npm run build --analyze
```

## SSL Certificate

### For Self-Hosted
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com
```

### Update Nginx
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## Monitoring

### Google Analytics
```javascript
// In index.js or App.js
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

## Troubleshooting

### Blank Page
- Check console for JavaScript errors
- Verify API_URL environment variable
- Clear browser cache

### API Connection Issues
- Verify backend is running
- Check CORS configuration
- Verify API_URL in .env

### Build Fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check for syntax errors: `npm run build`

## Testing Before Deployment

### Run Tests
```bash
npm test
```

### Build Locally
```bash
npm run build
serve -s build
```

### Test Performance
```bash
npm run build
npm install -g lighthouse
lighthouse http://localhost:3000
```
