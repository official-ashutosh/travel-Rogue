# Travel Planner AI Backend

A comprehensive backend API for the Travel Planner AI application built with Express.js, Node.js, and MongoDB.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Password reset functionality
  - User profile management
  - Credit system for AI generations

- **AI-Powered Travel Planning**
  - Integration with OpenAI GPT for travel content generation
  - Batch processing for different content types
  - Structured travel itineraries

- **Plan Management**
  - Create, read, update, delete travel plans
  - Public/private plan visibility
  - Plan sharing and collaboration

- **Expense Tracking**
  - Detailed expense management
  - Category-wise expense analytics
  - Multi-currency support

- **Payment Processing**
  - Stripe integration for global payments
  - Razorpay integration for Indian payments
  - Credit packages system

- **Collaboration Features**
  - Plan invitations via email
  - Access control and permissions
  - Shared plan management

- **Feedback System**
  - User feedback collection
  - Admin panel for feedback management
  - Email notifications

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: Stripe, Razorpay
- **AI Integration**: OpenAI GPT-4
- **Email Service**: Nodemailer
- **File Upload**: Multer with Cloudinary
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-planner-ai/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travel-planner-ai
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/change-password` - Change password

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/credits` - Get user credits
- `POST /api/users/credits/reduce` - Reduce user credits

### Plan Management

- `POST /api/plans` - Create new plan
- `GET /api/plans/my-plans` - Get user's plans
- `GET /api/plans/:planId` - Get specific plan
- `PUT /api/plans/:planId` - Update plan
- `DELETE /api/plans/:planId` - Delete plan
- `POST /api/plans/:planId/generate` - Generate AI content
- `GET /api/plans/public` - Get public plans

### Expense Management

- `POST /api/expenses` - Create expense
- `GET /api/expenses/my-expenses` - Get user expenses
- `GET /api/expenses/plan/:planId` - Get plan expenses
- `PUT /api/expenses/:expenseId` - Update expense
- `DELETE /api/expenses/:expenseId` - Delete expense
- `GET /api/expenses/plan/:planId/analytics` - Get expense analytics

### Payment Processing

- `GET /api/payments/packages` - Get credit packages
- `POST /api/payments/stripe/create-session` - Create Stripe session
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/stripe/verify` - Verify Stripe payment
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `GET /api/payments/history` - Get payment history

### Invitations

- `POST /api/invites` - Send plan invitation
- `GET /api/invites/:token` - Get invite details
- `POST /api/invites/:token/accept` - Accept invitation
- `POST /api/invites/:token/reject` - Reject invitation
- `GET /api/invites/plan/:planId` - Get plan invitations

### Feedback

- `POST /api/feedback` - Create feedback
- `GET /api/feedback/my-feedback` - Get user feedback
- `GET /api/feedback/all` - Get all feedback (admin)
- `PUT /api/feedback/:feedbackId` - Update feedback (admin)
- `DELETE /api/feedback/:feedbackId` - Delete feedback

## Database Schema

### User
- userId (UUID)
- email
- password (hashed)
- firstName, lastName
- credits, freeCredits
- timestamps

### Plan
- nameoftheplace
- userPrompt
- abouttheplace
- adventuresactivitiestodo
- topplacestovisit
- packingchecklist
- localcuisinerecommendations
- itinerary
- userId
- isPublic
- timestamps

### Expense
- planId
- userId
- amount
- purpose
- category
- date
- currency
- timestamps

### Payment
- paymentId
- email
- amount
- method (stripe/razorpay)
- status
- userId
- creditsAdded
- timestamps

## Security Features

- **Password Hashing**: bcryptjs with salt
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents API abuse
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Express Validator
- **SQL Injection Prevention**: Mongoose ODM
- **XSS Protection**: Helmet middleware

## Error Handling

The API uses consistent error response format:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start src/index.js --name "travel-planner-api"

# Monitor the application
pm2 monit
```

### Using Docker

```bash
# Build image
docker build -t travel-planner-api .

# Run container
docker run -d -p 5000:5000 --name travel-planner-api travel-planner-api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [your-email@example.com] or create an issue in the repository.
