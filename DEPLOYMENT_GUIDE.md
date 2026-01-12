# Deployment Guide for NeuroVisionAI Pro

This guide explains how to deploy the Brain Tumor Detection platform with medicine ordering and UPI payments.

## Architecture Overview

The application has two main components:
1. **Frontend**: React/Vite application (deployed on Vercel)
2. **Backend**: FastAPI server (deployed on Render)

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account
- Completed GitHub repository setup
- Backend already deployed on Render

### Steps
1. Deploy backend first (see Backend Deployment section)
2. Get your backend URL from Render dashboard
3. Push all code to the GitHub repository
4. Go to [Vercel](https://vercel.com)
5. Sign in with your GitHub account
6. Click "New Project" and select your repository
7. Configure environment variables:
   - `VITE_API_URL`: URL of your deployed backend API
8. Deploy the project

### Environment Variables for Vercel
- `VITE_API_URL`: Point this to your backend API URL (e.g., `https://your-app-name.onrender.com`)
  **Important**: The backend must be deployed and running before setting this value

## Backend Deployment (Render)

### Prerequisites
- Render account
- Google Drive model file accessible

### Steps
1. Push the backend code to a GitHub repository
2. Go to [Render](https://render.com)
3. Create a new Web Service
4. Connect to your GitHub repository
5. Use the provided `render.yaml` configuration
6. The build command will automatically download the model file
7. The server will start automatically

### Environment Variables for Render (if needed)
- `PYTHON_VERSION`: 3.10.0 (already configured in render.yaml)

## API Endpoints

### Frontend (Vercel)
- Main application: `https://your-project.vercel.app`
- All UI interactions happen here

### Backend (Render)
- Health check: `GET /`
- Prediction: `POST /predict`
- Medicine search: `GET /api/medicine/search/{query}`
- Place order: `POST /api/medicine/order`
- Order status: `GET /api/medicine/order/{order_id}`
- Analytics: `GET /api/medicine/analytics`

## Medicine Ordering System

The medicine ordering system includes:
- Real-time price comparison across pharmacies
- UPI payment processing
- Automatic 5% commission to `rajdeepbiswas403-1@okhdfcbank`
- Order tracking and analytics
- SQLite database for order persistence

## Troubleshooting

### Frontend Issues
- Ensure `VITE_API_URL` is correctly set to your backend URL
- Check browser console for API connection errors
- If predictions aren't working, verify the backend is deployed and accessible
- Make sure you're testing with the correct domain after deployment

### Backend Issues
- Verify model file is accessible and properly downloaded
- Check Render logs for any startup errors
- Ensure the database initializes correctly

### Connection Issues Between Frontend and Backend
- The most common issue is incorrect `VITE_API_URL` configuration
- Make sure the backend is fully deployed and responding before configuring the frontend
- Test your backend API directly (e.g., visit https://your-backend.onrender.com/) to ensure it's running
- Check CORS settings if you encounter cross-origin errors

### Model Download Issues
- The `download_model.py` script handles model download during deployment
- Ensure the Google Drive link in `download_model.py` is accessible

## Performance Considerations

- The Vision Transformer model is loaded on first prediction or at startup
- Model file is cached after initial download
- Medicine ordering database is SQLite (sufficient for initial deployment)
- API endpoints are optimized for response time

## Security

- UPI payments are processed through secure channels
- API endpoints include proper error handling
- Input validation is implemented for file uploads
- CORS is enabled for web application access

## Scaling

For production scaling:
- Consider moving from SQLite to PostgreSQL for medicine orders
- Add Redis for caching frequently accessed data
- Implement CDN for static assets
- Consider GPU instances for faster model inference