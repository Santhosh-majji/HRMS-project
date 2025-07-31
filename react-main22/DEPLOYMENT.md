# HRMS Deployment Guide for Render

## Project Structure
```
react-main22/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── ...
├── client/
│   ├── src/               # React source code
│   ├── public/            # React public files
│   ├── package.json       # Frontend dependencies
│   └── ...
├── package.json           # Root package.json with deployment scripts
└── DEPLOYMENT.md          # This file
```

## Deployment Steps for Render

### 1. Prepare Your Repository
- Ensure all code is committed to your Git repository
- Push to GitHub/GitLab/Bitbucket

### 2. Create New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your repository

### 3. Configure Build & Deploy Settings
```
Build Command: npm run install-client && npm run build-client
Start Command: npm start
```

### 4. Environment Variables
Set these in Render dashboard:
- `NODE_ENV=production`
- `PORT=10000` (Render will set this automatically)
- Add your database credentials:
  - `DB_HOST=your_db_host`
  - `DB_USER=your_db_user`
  - `DB_PASSWORD=your_db_password`
  - `DB_NAME=your_db_name`

### 5. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your app

## Local Development Commands

```bash
# Install dependencies
npm install
npm run install-client

# Build React app
npm run build-client

# Start production server
npm start

# Start development server
npm run dev
```

## Important Notes

1. **Single URL**: The app serves both frontend and backend from one URL
2. **Static Files**: React build files are served from `/client/build`
3. **API Routes**: All API endpoints start with `/api/`
4. **Fallback**: All non-API routes serve the React app (SPA routing)

## Troubleshooting

- Ensure `package.json` scripts are correct
- Check that `server.js` serves static files properly
- Verify environment variables are set in Render
- Check build logs for any errors