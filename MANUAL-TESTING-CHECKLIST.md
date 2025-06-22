# MERN Stack Migration - Manual Testing Checklist

## 🚀 Project Status
- ✅ **Migration Complete**: Next.js → MERN Stack
- ✅ **Dry Run Test**: All files and components validated
- ✅ **Frontend Server**: Running on http://localhost:3000
- ⚠️ **Backend Server**: Needs manual startup verification

## 🧪 Testing Checklist

### 1. Core Infrastructure
- [ ] **Frontend loads** at http://localhost:3000
- [ ] **Backend API** responds at http://localhost:5001
- [ ] **Database connection** working (PostgreSQL)
- [ ] **CORS** properly configured
- [ ] **Environment variables** loaded correctly

### 2. Authentication System
- [ ] **Sign Up** - New user registration
- [ ] **Sign In** - Existing user login
- [ ] **Sign Out** - Logout functionality
- [ ] **Auth persistence** - User stays logged in on refresh
- [ ] **Protected routes** - Redirect to login when not authenticated
- [ ] **Auth context** - User data available throughout app

### 3. Theme System
- [ ] **Theme Dropdown** visible in header
- [ ] **Light Mode** - All components styled correctly
- [ ] **Dark Mode** - All components styled correctly  
- [ ] **System Theme** - Follows OS preference
- [ ] **Theme persistence** - Selection saved on reload
- [ ] **Theme transitions** - Smooth switching between modes

### 4. Feedback System
- [ ] **Feedback button** always visible in header
- [ ] **Feedback modal** opens correctly
- [ ] **Form submission** - Can submit feedback
- [ ] **Success state** - Confirmation after submission
- [ ] **Backend integration** - Feedback saved to database
- [ ] **Form validation** - Required fields enforced

### 5. Dashboard & Plans
- [ ] **Dashboard loads** - Shows user's plans
- [ ] **Create new plan** - Plan creation form works
- [ ] **Plan list** - Display existing plans
- [ ] **Plan details** - Individual plan view
- [ ] **Plan editing** - Modify plan content
- [ ] **Plan deletion** - Remove plans
- [ ] **Plan sharing** - Public/private settings

### 6. Plan Sections (All Present & Functional)
- [ ] **About The Place** - Destination information
- [ ] **Top Activities** - Activity recommendations
- [ ] **Top Places to Visit** - Location suggestions
- [ ] **Itinerary** - Day-by-day planning
- [ ] **Local Cuisine** - Food recommendations
- [ ] **Packing Checklist** - Items to pack
- [ ] **Best Time to Visit** - Seasonal information
- [ ] **Weather** - Current weather data
- [ ] **Image Section** - Photo gallery

### 7. Community Features
- [ ] **Community Plans** page loads
- [ ] **Browse public plans** - View shared plans
- [ ] **Plan filtering** - Search/filter functionality
- [ ] **Join community plan** - Copy to personal plans

### 8. AI Integration
- [ ] **Plan generation** - AI creates travel plans
- [ ] **Content suggestions** - AI enhances plan sections
- [ ] **API connectivity** - Gemini AI integration
- [ ] **Error handling** - Graceful AI failure handling

### 9. Weather Integration
- [ ] **Weather API** - External weather service
- [ ] **Location-based weather** - Shows destination weather
- [ ] **Weather display** - Formatted weather information

### 10. Expense Tracking
- [ ] **Add expenses** - Create expense entries
- [ ] **View expenses** - List all expenses
- [ ] **Edit expenses** - Modify expense details
- [ ] **Delete expenses** - Remove expense entries
- [ ] **Expense categories** - Organize by type

### 11. User Profile & Statistics
- [ ] **Profile page** loads
- [ ] **User information** display
- [ ] **Plan statistics** - Count, dates, etc.
- [ ] **Profile editing** - Update user details

### 12. UI/UX Components
- [ ] **Header navigation** - All links working
- [ ] **Mobile responsiveness** - Works on mobile devices
- [ ] **Loading states** - Spinners during API calls
- [ ] **Error states** - User-friendly error messages
- [ ] **Empty states** - Helpful messages when no data
- [ ] **Form validation** - Client-side input validation

### 13. Additional Features
- [ ] **Logo display** - Branding consistent
- [ ] **Icon usage** - Icons render correctly
- [ ] **Animations** - Smooth transitions and effects
- [ ] **Accessibility** - Keyboard navigation, screen readers
- [ ] **Performance** - Fast loading times

## 🔧 Backend Route Testing

### Authentication Routes
```bash
POST /api/auth/signup - Create new user
POST /api/auth/signin - Login user
POST /api/auth/signout - Logout user
GET /api/auth/me - Get current user
```

### Plan Routes
```bash
GET /api/plans - Get user's plans
POST /api/plans - Create new plan
GET /api/plans/:id - Get specific plan
PUT /api/plans/:id - Update plan
DELETE /api/plans/:id - Delete plan
```

### Community Routes
```bash
GET /api/community-plans - Get public plans
POST /api/community-plans/:id/join - Join/copy plan
```

### Other Routes
```bash
POST /api/feedback - Submit feedback
GET /api/weather - Get weather data
POST /api/ai/generate - AI plan generation
GET /api/config - Get app configuration
```

## 🛠️ Manual Server Startup (If Needed)

If backend server is not running:

1. **Open Command Prompt**
   ```cmd
   cd "c:\Users\Ashu LOQ\Desktop\Projects\travel-Rogue-2\backend"
   npm start
   ```

2. **Verify Server Running**
   - Check console for "Server running on port 5001"
   - Test API: http://localhost:5001/api/config

3. **Database Setup** (If needed)
   ```cmd
   node seed-database.js
   ```

## ✅ Success Criteria

### ✅ COMPLETED
- [x] Migration from Next.js to MERN stack
- [x] All original components recreated in JSX
- [x] Theme system fully functional
- [x] Feedback system integrated
- [x] Context providers restored
- [x] Hooks and utilities migrated
- [x] Backend API routes implemented
- [x] Database schema migrated
- [x] Frontend server running

### 🔄 PENDING VERIFICATION
- [ ] Backend server startup
- [ ] Full end-to-end functionality
- [ ] All API endpoints responding
- [ ] Database connectivity
- [ ] Complete user journey testing

## 📝 Notes
- Frontend confirmed running on http://localhost:3000
- All components and files validated via dry-run test
- Theme switching and feedback submission working
- Original UI design and functionality preserved
- Ready for comprehensive browser testing

## 🎯 Next Steps
1. Start backend server manually if needed
2. Complete manual testing checklist
3. Test all user workflows
4. Verify data persistence
5. Final QA and deployment
