# Deployment Guide for Render.com

This guide will help you deploy the Travel Rogue application on Render.com.

## Prerequisites

1. GitHub account with your project repository
2. Render.com account
3. PostgreSQL database (Render provides free PostgreSQL)
4. Required API keys (Google Maps, Gemini AI, Stripe, etc.)

## Step 1: Prepare Your Repository

1. Push your cleaned project to GitHub
2. Ensure both `backend` and `frontend` folders are in the root
3. Make sure `.env.example` files are present in both directories

## Step 2: Create PostgreSQL Database

1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Choose a name for your database
4. Select the free plan
5. Click "Create Database"
6. Copy the "External Database URL" - you'll need this for the backend

## Step 3: Deploy Backend (Web Service)

1. In Render Dashboard, click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `travel-rogue-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. Add Environment Variables:
   ```
   DATABASE_URL=your_postgresql_url_from_step2
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   NODE_ENV=production
   PORT=10000
   GEMINI_API_KEY=your_gemini_api_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   WEATHER_API_KEY=your_weather_api_key
   ```

5. Click "Create Web Service"
6. Wait for deployment to complete
7. Note the service URL (e.g., `https://travel-rogue-backend.onrender.com`)

## Step 4: Run Database Migration

1. Once backend is deployed, go to the service's "Shell" tab
2. Run: `npm run migrate`
3. This will create all necessary database tables

## Step 5: Deploy Frontend (Static Site)

1. In Render Dashboard, click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: `travel-rogue-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://travel-rogue-backend.onrender.com
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. Click "Create Static Site"
6. Wait for deployment to complete

## Step 6: Configure CORS (if needed)

If you encounter CORS issues, update your backend's CORS configuration to include your frontend URL.

## Step 7: Set Up Custom Domain (Optional)

1. Go to your frontend service settings
2. Add your custom domain
3. Configure DNS records as instructed by Render

## Important Notes

### Free Tier Limitations
- Services on free tier sleep after 15 minutes of inactivity
- First request after sleep may take 30+ seconds
- PostgreSQL free tier has limited storage

### Environment Variables Security
- Never commit `.env` files to your repository
- Use strong, unique values for JWT_SECRET
- Keep API keys secure

### Database Backup
- Render free PostgreSQL doesn't include automatic backups
- Consider upgrading for production use

### Monitoring
- Monitor your services through Render dashboard
- Check logs for any deployment issues
- Set up error monitoring for production

## Troubleshooting

### Common Issues

1. **Build Fails**: Check package.json scripts and dependencies
2. **Database Connection**: Verify DATABASE_URL format
3. **CORS Errors**: Update backend CORS configuration
4. **API Calls Fail**: Check REACT_APP_API_URL points to correct backend
5. **Environment Variables**: Ensure all required variables are set

### Getting Help

- Check Render documentation
- Review application logs in Render dashboard
- Ensure all API keys are valid and have proper permissions

## Post-Deployment Checklist

- [ ] Backend service is running and accessible
- [ ] Frontend site loads correctly
- [ ] Database migrations completed successfully
- [ ] User registration/login works
- [ ] API endpoints respond correctly
- [ ] Payment integration works (if configured)
- [ ] Email notifications work (if configured)
- [ ] All features tested in production environment

Your Travel Rogue application should now be live and accessible to users!
