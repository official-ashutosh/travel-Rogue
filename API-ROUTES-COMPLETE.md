# API Routes - Complete List

## ✅ Auth Routes (`/api/auth`)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login  
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/signout` - User logout

## ✅ Plans Routes (`/api/plans`)
- `GET /api/plans` - Get user's plans (protected)
- `POST /api/plans` - Create new plan (protected)
- `GET /api/plans/:id` - Get specific plan (protected)
- `PUT /api/plans/:id` - Update plan (protected)
- `DELETE /api/plans/:id` - Delete plan (protected)

## ✅ Community Plans Routes (`/api/community-plans`)
- `GET /api/community-plans` - Get public/community plans
- `POST /api/community-plans/:id/publish` - Publish plan to community (protected)

## ✅ Expenses Routes (`/api/expenses`)
- `GET /api/expenses/:planId` - Get expenses for a plan (protected)
- `POST /api/expenses` - Add expense (protected)
- `PUT /api/expenses/:id` - Update expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)

## ✅ Users Routes (`/api/users`)
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/stats` - Get user statistics (protected)

## ✅ AI Routes (`/api/ai`)
- `POST /api/ai/generate-plan` - Generate AI travel plan (protected)
- `POST /api/ai/enhance-itinerary` - Enhance existing itinerary (protected)

## ✅ Weather Routes (`/api/weather`)
- `GET /api/weather/:location` - Get weather data for location

## ✅ Config Routes (`/api/config`) - **NEWLY ADDED**
- `GET /api/config` - Check API configuration and service status

## ✅ Health Check
- `GET /api/health` - API health check

## Frontend Route Mapping

All frontend API calls are properly mapped:

```javascript
// AuthContext.jsx
axios.get('/auth/me')           → GET /api/auth/me
axios.post('/auth/signin')      → POST /api/auth/signin  
axios.post('/auth/signup')      → POST /api/auth/signup
axios.post('/auth/signout')     → POST /api/auth/signout

// Plans
api.get('/api/plans')           → GET /api/plans
api.delete(`/api/plans/${id}`)  → DELETE /api/plans/:id
api.get(`/api/plans/${id}`)     → GET /api/plans/:id

// Community Plans  
api.get('/api/community-plans') → GET /api/community-plans
```

## Missing Routes - None Found ✅

All necessary API routes from the original Next.js project have been successfully migrated to the Express backend. The `/api/config` route that was missing has now been added.

## Backend Configuration

All routes are properly configured in `backend/server.js`:

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/community-plans', communityPlanRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/config', configRoutes); // NEWLY ADDED
```
