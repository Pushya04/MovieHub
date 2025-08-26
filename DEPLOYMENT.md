# Frontend Deployment Guide

## Deploy to Render

### Prerequisites
- Render account
- GitHub repository with your code
- Node.js 18+ installed locally

### Method 1: Manual Deployment via Render Dashboard

1. **Sign in to [Render.com](https://render.com)**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `moviehub-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment**: `Static Site`

### Method 2: GitHub Actions (Automatic)

1. **Push your code to GitHub**
2. **Set up Render secrets in GitHub:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add `RENDER_SERVICE_ID` (get from Render dashboard)
   - Add `RENDER_API_KEY` (get from Render account settings)
3. **The workflow will automatically deploy on push to main/master**

### Method 3: Local Build and Deploy

1. **Build locally:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload the `dist` folder to Render manually**

### Environment Variables

Set these in your Render service:
- `NODE_ENV`: `production`
- `REACT_APP_API_URL`: Your backend API URL

### Build Commands

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

### Troubleshooting

- **Build fails**: Check Node.js version (18+ required)
- **Dependencies missing**: Ensure `package-lock.json` is committed
- **Routing issues**: Ensure SPA routing is configured in Render

### Performance Tips

- Enable gzip compression in Render
- Use CDN for static assets
- Optimize images before build
- Enable browser caching
