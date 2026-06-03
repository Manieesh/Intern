# Quick Start Guide - Service Booking Platform

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB Atlas account
- Razorpay account (sandbox mode for testing)

## Backend Setup (5 minutes)

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and Razorpay keys

# 3. Seed sample data
npm run seed

# 4. Start development server
npm run dev
```

**Backend running at:** `http://localhost:5000`

## Frontend Setup (5 minutes)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Setup environment
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# 3. Start development server
npm start
```

**Frontend running at:** `http://localhost:3000`

## 🧪 Test the App

### Login Credentials (from seed data)

**Admin Dashboard:**
- Email: `admin@servicehub.com`
- Password: `admin123`

**Customer:**
- Email: `rajesh@email.com`
- Password: `password123`

**Service Provider:**
- Email: `john.plumber@email.com`
- Password: `password123`

## 📁 Project Structure

```
backend/          → Express.js server
├── src/
│   ├── models/   → MongoDB schemas
│   ├── controllers/ → Business logic
│   ├── routes/   → API endpoints
│   ├── middleware/ → Auth, validation
│   └── utils/    → Helper functions
│
frontend/         → React.js app
├── src/
│   ├── pages/    → Page components
│   ├── components/ → Reusable components
│   ├── services/ → API integration
│   └── context/  → Auth state management
```

## 🔑 Key Features to Test

### Customer Features
1. Register as customer
2. Browse services by category
3. Create booking
4. Pay with Razorpay (test card: 4111111111111111)
5. Leave reviews

### Provider Features
1. Register as provider
2. Create service listings
3. View bookings in dashboard
4. Update booking status
5. Track earnings

### Admin Features
1. View dashboard statistics
2. Manage users and providers
3. Verify new providers
4. View all bookings and payments

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
- Check MongoDB URI in .env
- Verify IP whitelist in MongoDB Atlas

**"CORS error"**
- Ensure backend is running
- Check FRONTEND_URL in backend .env

**"Page not loading"**
- Clear browser cache
- Check console for errors
- Verify API URL in frontend .env.local

## 📚 Documentation

- Backend API: See `DEPLOYMENT.md`
- Frontend Setup: See `FRONTEND_DEPLOYMENT.md`
- Full README: See `README.md`

## 🚀 Next Steps

1. **Customize branding** - Update logo, colors, text
2. **Add more services** - Edit seed data with more services
3. **Domain setup** - Configure domain and SSL
4. **Email notifications** - Setup SMTP for email alerts
5. **Analytics** - Add Google Analytics or Mixpanel

## 💡 Tips

- Use **Razorpay Test Mode** - Test payments without real money
- **Sample Data** - Run `npm run seed` to populate test data
- **Mobile Testing** - Use DevTools device emulation
- **API Testing** - Use Postman or Insomnia for API calls

## 📞 Support

- Check MongoDB docs: https://docs.mongodb.com
- Razorpay docs: https://razorpay.com/docs
- React docs: https://react.dev
- Express docs: https://expressjs.com

---

**Happy coding! 🎉**
