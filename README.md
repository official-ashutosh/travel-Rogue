# Travel Rogue 🌍

## Your AI-powered travel companion for creating unforgettable journeys

Travel Rogue transforms the way you plan trips by combining cutting-edge AI technology with comprehensive travel management tools. Whether you're planning a weekend getaway or a month-long adventure, our platform makes it effortless to create personalized itineraries, track expenses, and discover amazing destinations.

> **📁 Note:** This project has been migrated from Next.js to a MERN stack architecture. See [README-MERN.md](./README-MERN.md) and [MIGRATION-FINAL.md](./MIGRATION-FINAL.md) for details about the new structure and setup instructions.

---

## ✨ Key Features

### 🤖 **AI-Powered Trip Generation**

- **Smart Planning with Gemini AI:** Simply describe your dream trip (e.g., "5-day romantic getaway to Paris for $2000") and watch our AI create a complete, personalized itinerary
- **Intelligent Recommendations:** Get tailored suggestions based on your travel preferences, dates, and companion type
- **Activity Matching:** AI considers your interests (adventure, culture, food, etc.) to curate perfect activities

### 📋 **Comprehensive Itinerary Management**

- **Day-by-Day Planning:** Organized morning, afternoon, and evening activities with detailed descriptions
- **Interactive Timeline:** Visual itinerary with easy editing and rearrangement capabilities
- **Location Integration:** Interactive maps showing all your planned destinations
- **Custom Activities:** Add, edit, or remove activities to perfectly match your style

### 💰 **Smart Expense Tracking**

- **Real-time Budget Management:** Track expenses by category (food, transport, shopping, etc.)
- **Multi-Currency Support:** Automatic currency conversion and preferred currency settings
- **Expense Analytics:** Visual insights into your spending patterns and budget allocation
- **Collaborative Expenses:** Share and split costs with travel companions

### 🌤️ **Live Weather Integration**

- **Real-time Weather Data:** Current conditions and forecasts powered by OpenWeather API
- **Trip Planning Insights:** Weather-based recommendations for packing and activities
- **Visual Weather Display:** Intuitive weather cards with temperature, humidity, and visibility

### 🗺️ **Smart Destination Discovery**

- **Top Places to Visit:** AI-curated list of must-see attractions and hidden gems
- **Interactive Maps:** Google Maps integration with custom markers and directions
- **Local Cuisine Recommendations:** Discover authentic local foods and restaurants
- **Adventure Activities:** Personalized activity suggestions based on your preferences

### 👥 **Social & Collaborative Features**

- **Community Plans:** Browse and get inspired by public travel plans from other users
- **Plan Sharing:** Share your itineraries with friends or make them public for the community
- **Companion Planning:** Specify travel companions (solo, couple, friends, family) for tailored recommendations
- **Collaborative Editing:** Invite others to contribute to your travel plans

### 📱 **Modern User Experience**

- **Responsive Design:** Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode:** Choose your preferred theme for comfortable planning
- **Offline Planning:** Access your plans even without internet connection
- **Export Options:** Download or share your itineraries in various formats

---


## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Shadcn-UI components
- **Backend:** Next.js API Routes, PostgreSQL
- **AI Integration:** Google Gemini API for intelligent travel planning
- **Weather Data:** OpenWeather API for real-time weather information
- **Maps:** Google Maps API for location services and mapping
- **Database:** PostgreSQL for data persistence
- **Authentication:** Custom JWT-based authentication
- **State Management:** React Context API
- **Form Handling:** React Hook Form with Zod validation
- **Deployment:** Vercel-ready with environment configuration

---

## � Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for:
  - Google Gemini AI
  - OpenWeather API  
  - Google Maps API

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/official-ashutosh/travel-Rogue.git
   cd travel-Rogue
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory with:

   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/travel_rogue

   # AI Services
   GEMINI_API_KEY=your_gemini_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key

   # Maps & Location
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Set up the database:**

   ```sql
   -- Create the main tables
   CREATE TABLE plans (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     nameoftheplace TEXT,
     preferred_currency TEXT DEFAULT 'INR',
     user_id TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE expenses (
     _id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
     amount NUMERIC,
     description TEXT,
     category TEXT,
     date DATE
   );

   CREATE TABLE feedback (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
     label TEXT,
     message TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**

   Visit [http://localhost:3000](http://localhost:3000) to see your Travel Rogue instance!

### API Endpoints

- `GET /api/plans` - List user's travel plans
- `POST /api/plans` - Create a new travel plan
- `GET /api/plans/[planId]` - Get specific plan details
- `PATCH /api/plans/[planId]` - Update plan information
- `DELETE /api/plans/[planId]` - Delete a travel plan
- `GET /api/weather` - Get weather data for a location
- `POST /api/expenses/delete-multiple` - Bulk delete expenses
- `GET /api/community-plans` - Browse public community plans

## 📸 Screenshots & Demo

### AI-Powered Plan Generation
![AI Plan Generation](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=AI+Travel+Plan+Generation)

### Interactive Itinerary Management  
![Itinerary Management](https://via.placeholder.com/800x400/059669/FFFFFF?text=Day-by-Day+Itinerary+Planning)

### Real-time Expense Tracking
![Expense Tracking](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Smart+Expense+Analytics)

```
Frontend (Next.js + React)
    ↓
API Layer (Next.js API Routes)
    ↓
Database (PostgreSQL)
    ↓
External APIs (Gemini AI, OpenWeather, Google Maps)
```

### Key Components:
- **Client-Side:** React components with TypeScript for type safety
- **Server-Side:** Next.js API routes handling business logic
- **AI Integration:** Gemini API for intelligent content generation
- **Real-time Data:** OpenWeather API for current weather conditions
- **Data Persistence:** PostgreSQL with optimized schemas
- **Authentication:** JWT-based session management

---

## 🌟 Use Cases

### For Solo Travelers
- Generate personalized itineraries based on your interests
- Track expenses and stay within budget
- Discover hidden gems and local experiences
- Access real-time weather information

### For Groups & Families  
- Collaborative planning with multiple contributors
- Shared expense tracking and splitting
- Activity suggestions for different age groups
- Public plan sharing for inspiration

### For Travel Enthusiasts
- Browse community plans for inspiration
- Share your favorite trips with others
- Discover trending destinations
- Build a library of memorable journeys

---


## 🙏 Acknowledgments

- **Google Gemini AI** for powerful travel planning capabilities
- **OpenWeather** for reliable weather data
- **Google Maps** for comprehensive location services
- **Vercel** for seamless deployment and hosting
- **Our Contributors** for making Travel Rogue better every day

---

*Made with ❤️ for travelers around the world*
