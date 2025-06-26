# Travel Rogue 🌍

## Your AI-powered travel companion for creating unforgettable journeys

Travel Rogue is a comprehensive full-stack travel planning platform that combines cutting-edge **AI technology** with modern web development to revolutionize how people plan, manage, and share their travel experiences. Built with **React.js**, **Node.js**, **Express.js**, and **PostgreSQL**, and powered by **Google Gemini AI**, the platform delivers personalized travel itineraries, real-time expense tracking, and collaborative planning features.

---

## ✨ Key Features

### 🤖 **AI-Powered Trip Generation**
- **Intelligent Itinerary Creation**: Generate comprehensive travel plans using Google Gemini AI with natural language prompts
- **Personalized Recommendations**: AI analyzes travel preferences, companion type, budget, and interests for tailored suggestions
- **Smart Activity Matching**: Automatic activity curation based on destination, duration, and personal preferences
- **Multi-format Output**: Generates detailed itineraries, packing lists, cuisine recommendations, and best visit times

### 📋 **Comprehensive Travel Management**
- **Day-by-Day Itinerary Planning**: Structured morning, afternoon, and evening activity scheduling
- **Interactive Timeline Management**: Visual itinerary with drag-and-drop editing capabilities
- **Location-Based Services**: Google Maps integration with custom markers and route optimization
- **Weather Integration**: Real-time weather data and forecasts using OpenWeather API

### 💰 **Smart Expense Tracking**
- **Real-time Budget Management**: Track expenses by category (accommodation, food, transport, activities)
- **Multi-Currency Support**: Automatic currency conversion with real-time exchange rates
- **Expense Analytics**: Visual insights and spending pattern analysis with charts and reports
- **Collaborative Expense Splitting**: Share and split costs with travel companions

### 👥 **Social & Collaborative Features**
- **Community Plans**: Browse public travel plans and get inspired by other travelers
- **Plan Sharing**: Share itineraries with friends or publish for community inspiration
- **Invitation System**: Invite collaborators to contribute to travel plans
- **User Authentication**: Secure JWT-based authentication with profile management

### 🗺️ **Smart Destination Discovery**
- **Location Autocomplete**: Google Places API integration for intelligent location search
- **Top Attractions**: AI-curated lists of must-visit places with coordinates and descriptions
- **Local Cuisine Recommendations**: Discover authentic local foods and restaurant suggestions
- **Adventure Activity Suggestions**: Personalized activity recommendations based on interests
- **Collaborative Editing:** Invite others to contribute to your travel plans

### 📱 **Modern User Experience**

- **Responsive Design:** Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode:** Choose your preferred theme for comfortable planning
- **Offline Planning:** Access your plans even without internet connection
- **Export Options:** Download or share your itineraries in various formats

---


## 🛠️ Tech Stack

### **Frontend**

- **React.js 18** - Modern component-based UI library
- **React Router Dom** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Lucide React** - Beautiful icon library for consistent UI
- **Axios** - HTTP client for API communication
- **React Hook Form** - Performant form handling with validation

### **Backend**

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Robust relational database with ACID compliance
- **Sequelize** - Promise-based ORM for PostgreSQL with powerful querying
- **JWT** - JSON Web Tokens for secure authentication
- **Bcrypt** - Password hashing for security

### **AI & External APIs**

- **Google Gemini AI** - Advanced AI for intelligent travel planning
- **Google Maps API** - Location services and mapping functionality
- **Google Places API** - Location search and autocomplete
- **OpenWeather API** - Real-time weather data and forecasts

### **DevOps & Security**

- **Helmet** - Security middleware for Express applications
- **CORS** - Cross-origin resource sharing configuration
- **Express Rate Limit** - API rate limiting for security
- **Morgan** - HTTP request logging middleware
- **Compression** - Response compression for performance

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- API keys for:
  - Google Gemini AI
  - Google Maps API
  - OpenWeather API

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/official-ashutosh/travel-Rogue.git
   cd travel-Rogue
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration:**

   **Backend (.env):**

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=Travel-Rogue
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/Travel-Rogue
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   
   # AI Services
   GEMINI_API_KEY=your_gemini_api_key
   
   # External APIs
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

   **Frontend (.env):**

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Database Setup:**

   **First Time Setup (Run ONCE):**

   ```bash
   cd backend
   npm run migrate
   ```
   
   This will create all necessary PostgreSQL tables with the correct schema.

6. **Start the development servers:**

   **Backend:**

   ```bash
   cd backend
   npm start
   ```

   **Frontend:**

   ```bash
   cd frontend
   npm start
   ```

7. **Access the application:**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:5000>

---

## 📊 API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Password reset request

### **Travel Plans**

- `GET /api/plans` - Get user's travel plans
- `POST /api/plans` - Create new travel plan (with AI generation)
- `GET /api/plans/:id` - Get specific plan details
- `PUT /api/plans/:id` - Update plan information
- `DELETE /api/plans/:id` - Delete travel plan

### **AI Services**

- `POST /api/ai/generate-plan` - Generate AI-powered travel plan
- `POST /api/ai/suggest-destinations` - Get destination suggestions

### **Location Services**

- `GET /api/locations/search?q={query}` - Search locations
- `GET /api/locations/details/:placeId` - Get place details
- `GET /api/locations/popular` - Get popular destinations

### **Weather Services**

- `GET /api/weather/current/:location` - Current weather data
- `GET /api/weather/forecast/:location` - Weather forecast

### **Expense Management**

- `POST /api/expenses` - Create expense record
- `GET /api/expenses/plan/:planId` - Get plan expenses
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

---

## 🌟 Use Cases

### **For Solo Travelers**

- Generate personalized itineraries based on individual interests and budget
- Track personal expenses and maintain budget discipline
- Discover hidden gems and authentic local experiences
- Access real-time weather information for better planning

### **For Groups & Families**

- Collaborative planning with multiple contributors and shared decision-making
- Expense sharing and splitting with transparent cost tracking
- Activity suggestions suitable for different age groups and interests
- Group invitation system for seamless collaboration

### **For Travel Enthusiasts**

- Browse community-shared plans for destination inspiration
- Share favorite trips and travel experiences with the community
- Discover trending destinations and off-the-beaten-path locations
- Build a personal library of memorable travel experiences

### **For Travel Bloggers & Influencers**

- Create detailed, shareable itineraries for audience engagement
- Generate content-rich travel plans with comprehensive information
- Export and format travel plans for blog posts and social media
- Community feature for building follower engagement

---

## 🏗️ Architecture

```text
Frontend (React.js)
    ↓ HTTP/REST API
Backend (Express.js + Node.js)
    ↓ ORM (Sequelize)
Database (PostgreSQL)
    ↓ External APIs
AI Services (Google Gemini) + Location APIs (Google Maps) + Weather (OpenWeather)
```

### **Key Components:**

- **Client-Side**: React components with modern hooks and context for state management
- **Server-Side**: Express.js REST API with middleware for security and validation
- **AI Integration**: Google Gemini API for intelligent content generation and recommendations
- **Real-time Data**: OpenWeather API integration for current weather conditions and forecasts
- **Data Persistence**: PostgreSQL with Sequelize for robust relational data management and ACID compliance
- **Authentication**: JWT-based session management with secure password hashing

---

## 📱 Features in Detail

### **AI-Powered Planning**

- Natural language processing for travel requests
- Intelligent recommendation engine based on user preferences
- Automatic itinerary generation with time-optimized scheduling
- Smart budget allocation and expense prediction

### **Real-time Data Integration**

- Live weather updates and forecasts for travel dates
- Currency conversion with real-time exchange rates
- Location-based services with accurate geographical data
- Traffic and route optimization for transportation planning

### **User Experience**

- Responsive design optimized for desktop, tablet, and mobile devices
- Intuitive drag-and-drop interface for itinerary management
- Progressive web app capabilities for offline access
- Dark/light theme toggle for personalized user experience

### **Security & Performance**

- JWT-based authentication with secure session management
- Rate limiting and request throttling for API protection
- Input validation and sanitization for data security
- Optimized database queries and response compression

---

## 🔧 Development

### **Project Structure**

```text
travel-Rogue/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── services/          # External service integrations
│   │   └── config/            # Configuration files
│   └── package.json
├── frontend/                   # React.js frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utility functions
│   │   └── styles/            # CSS and styling
│   └── package.json
└── README.md
```

### **Available Scripts**

**Backend:**

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run migrate    # Run database migration (first time setup)
npm test          # Run test suite
npm run lint      # Run ESLint for code quality
```

**Frontend:**

```bash
npm start         # Start development server
npm run build     # Build for production
npm test          # Run test suite
npm run lint      # Run ESLint for code quality
```

---

## 🚀 Deployment

### **Production Build**

```bash
# Build frontend for production
cd frontend && npm run build

# Start backend in production mode
cd backend && NODE_ENV=production npm start
```

### **Environment Variables for Production**

- Update PostgreSQL URI to production database
- Configure secure JWT secrets
- Set appropriate CORS origins
- Configure rate limiting for production traffic

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful travel planning capabilities
- **OpenWeather** for reliable weather data APIs
- **Google Maps** for comprehensive location services
- **PostgreSQL** and **Sequelize** for reliable and robust database solutions
- **React.js** and **Express.js** communities for excellent documentation and support

---

## 📞 Support

For support, email <support@travel-rogue.com> or create an issue in the GitHub repository.

---

## Made with ❤️ for travelers around the world

**⭐ Star this repository if you found it helpful!**
