# Service Booking Platform - MERN Stack

A comprehensive full-stack local service booking platform built with MongoDB, Express, React, and Node.js.

## Features

### For Customers
- 🔐 Secure authentication and authorization
- 🔍 Search and filter services by category and price
- 📅 Easy booking scheduler with time slots
- 💳 Secure payment integration with Razorpay
- ⭐ Leave reviews and ratings
- 📱 Responsive mobile-friendly interface
- 🔔 Booking status tracking

### For Service Providers
- 📋 Create and manage service listings
- 📊 Provider dashboard with analytics
- 👥 Manage bookings and customer requests
- 💰 Earnings tracking
- ⭐ Rating and review management
- 📈 Service performance metrics

### For Admin
- 👨‍💼 User management and verification
- 📊 Comprehensive dashboard with statistics
- 🚨 Trust and safety management
- 💰 Payment and revenue tracking
- 📱 Service quality monitoring
- 🛡️ Dispute resolution

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment**: Razorpay Integration
- **Validation**: express-validator
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **UI Framework**: React.js 18+
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: React Icons
- **Date Handling**: date-fns
- **Notifications**: React Toastify
- **Form Handling**: React Hook Form

### Database
- **Primary**: MongoDB Atlas
- **Collections**: Users, Services, Bookings, Reviews, Payments

## Project Structure

```
service-booking-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── serviceController.js
│   │   │   ├── bookingController.js
│   │   │   ├── reviewController.js
│   │   │   ├── paymentController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Service.js
│   │   │   ├── Booking.js
│   │   │   ├── Review.js
│   │   │   └── Payment.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── helpers.js
│   │   │   └── razorpay.js
│   │   ├── seeders/
│   │   │   └── seedData.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Services.js
│   │   │   ├── Booking.js
│   │   │   ├── MyBookings.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── ProviderDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── config/
│   │   │   └── constants.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── tailwind.config.js
│   └── package.json
├── DEPLOYMENT.md
├── FRONTEND_DEPLOYMENT.md
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Razorpay account (for payment integration)

### Backend Setup

1. **Configure Environment**
```bash
cd backend
cp .env.example .env
```

2. **Update .env with your credentials**
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

3. **Install Dependencies**
```bash
npm install
```

4. **Seed Sample Data**
```bash
npm run seed
```

5. **Start Server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Create .env.local**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

3. **Install Dependencies**
```bash
npm install
```

4. **Start Development Server**
```bash
npm start
```

Visit `http://localhost:3000`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Services
- `POST /api/services` - Create service (Provider)
- `GET /api/services/provider/:providerId` - Get provider's services
- `GET /api/services/category/:category` - Get services by category
- `GET /api/services/search` - Search services
- `GET /api/services/:serviceId` - Get service details
- `PUT /api/services/:serviceId` - Update service (Provider)
- `DELETE /api/services/:serviceId` - Delete service (Provider)

### Bookings
- `POST /api/bookings` - Create booking (Customer)
- `GET /api/bookings/my-bookings` - Get customer bookings
- `GET /api/bookings/provider-bookings` - Get provider bookings
- `GET /api/bookings/:bookingId` - Get booking details
- `PUT /api/bookings/:bookingId/status` - Update booking status
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review (Customer)
- `GET /api/reviews/service/:serviceId` - Get service reviews
- `GET /api/reviews/provider/:providerId` - Get provider reviews
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:paymentId` - Get payment details

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/bookings` - All bookings
- `PUT /api/admin/users/:userId/verify` - Verify provider
- `PUT /api/admin/users/:userId/suspend` - Suspend user

## Deployment

### Backend Deployment
- See `DEPLOYMENT.md` for detailed instructions
- Supports: Heroku, AWS EC2, Docker

### Frontend Deployment
- See `FRONTEND_DEPLOYMENT.md` for detailed instructions
- Supports: Vercel, Netlify, AWS S3 + CloudFront, GitHub Pages

## Sample Credentials

### Test Users
```
Admin:
Email: admin@servicehub.com
Password: admin123

Customer:
Email: rajesh@email.com
Password: password123

Provider:
Email: john.plumber@email.com
Password: password123
```

## Key Features Implementation

### JWT Authentication
- Secure token-based authentication
- Role-based access control
- Token expiration handling

### Payment Integration
- Razorpay integration for secure payments
- Order creation and verification
- Transaction history tracking

### Search & Filtering
- Filter services by category
- Search by keywords
- Price range filtering

### Booking System
- Date and time slot selection
- Real-time status tracking
- Cancellation support

### Reviews & Ratings
- Verified purchase reviews
- 5-star rating system
- Review moderation by admins

## Best Practices

1. **Security**
   - Passwords hashed with bcryptjs
   - JWT tokens for authentication
   - CORS protection
   - Input validation and sanitization

2. **Performance**
   - MongoDB indexing on frequently queried fields
   - API response pagination
   - Optimized database queries

3. **Code Quality**
   - Clean code structure
   - Proper error handling
   - Comprehensive API documentation
   - Environment variable management

4. **Scalability**
   - Modular architecture
   - Reusable components
   - Database indexing
   - API rate limiting ready

## Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] Video verification for service providers
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] AI-powered service recommendations
- [ ] Advanced dispute resolution system
- [ ] Mobile app (React Native)
- [ ] Automated SMS/Email notifications
- [ ] Advanced scheduling/calendar integration
- [ ] Subscription plans for frequent services

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@servicehub.com or open an issue in the repository.

## Author

Created with ❤️ for the local services industry.
