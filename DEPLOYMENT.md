# 🚀 Deployment Guide for Prompt2Support

## Current Status
- ✅ **Frontend**: Deployed to Netlify at https://incredible-valkyrie-0b4354.netlify.app/
- ❌ **Backend**: Not deployed (needs separate deployment)

## Problem
The frontend is deployed to Netlify (static hosting) but the backend API calls are failing because there's no backend server running in production.

## Solution: Deploy Backend Separately

### Step 1: Deploy Backend to Render

1. **Go to Render**: https://render.com
2. **Create New Service** → "Web Service"
3. **Connect GitHub Repository**:
   - Repository: `TUMMALA-AKSHAYA/prompt2support`
   - Branch: `main`
4. **Configure Build Settings**:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend/`
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key_here`
   - `PORT`: `10000` (Render default)
6. **Deploy**: Click "Create Web Service"

### Step 2: Get Backend URL

After deployment, Render will give you a URL like:
```
https://your-app-name.onrender.com
```

### Step 3: Update Frontend Environment Variables

In your Netlify dashboard:

1. **Go to Site Settings** → **Environment variables**
2. **Add Variable**:
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: `https://your-backend-url.onrender.com` (from Step 2)
3. **Trigger Deploy**: Push a new commit or manually trigger deploy

### Step 4: Test the Application

1. Visit your Netlify URL: https://incredible-valkyrie-0b4354.netlify.app/
2. Try uploading a document
3. Ask questions - should now work with backend API

## Alternative: Single Deployment (Advanced)

For a simpler setup, you could deploy both frontend and backend to the same Render service, but that requires more configuration.

## Troubleshooting

### If API calls still fail:
1. Check browser console for CORS errors
2. Verify the `REACT_APP_BACKEND_URL` is set correctly in Netlify
3. Check Render logs for backend errors
4. Ensure `GEMINI_API_KEY` is set in Render environment variables

### Common Issues:
- **CORS errors**: Backend needs to allow requests from Netlify domain
- **API key missing**: Backend will fallback to demo responses
- **Port issues**: Render uses port 10000 by default

## Files Modified for Deployment

- `frontend/src/pages/Demo.jsx`: Added environment variable support
- `backend/render.yaml`: Render deployment configuration
- `backend/package.json`: Added dev script for consistency

## Final Architecture

```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Netlify       │ ---------------> │     Render      │
│   Frontend      │                  │    Backend      │
│   (Static)      │ <--------------- │   (Node.js)     │
└─────────────────┘    Responses     └─────────────────┘
```

This separation allows:
- Fast frontend loading from CDN
- Scalable backend with persistent storage
- Independent deployments
- Better performance and reliability