# Firebase Deployment Guide for FitForge

This guide explains how to deploy the FitForge application to Firebase Hosting as an alternative to Vercel.

## Prerequisites

- Firebase account
- Firebase CLI installed (`npm install -g firebase-tools`)

## Setup Steps

1. **Login to Firebase**
   ```
   firebase login
   ```

2. **Create a Firebase Project**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "fitforge-app" (or your preferred name)
   - Note the project ID

3. **Update .firebaserc**
   - Open `.firebaserc` and ensure the project ID matches your Firebase project:
   ```json
   {
     "projects": {
       "default": "YOUR_PROJECT_ID"
     }
   }
   ```

## Deployment

### Option 1: Using npm scripts

```
npm run deploy:firebase
```

This script will:
- Build your project
- Deploy to Firebase Hosting

### Option 2: Manual deployment

```
npm run build
firebase deploy
```

## Troubleshooting

- If you encounter permission issues, ensure you're logged in with the correct Firebase account
- If deployment fails, check the Firebase console for more detailed error messages
- For build errors, review the build logs and fix any issues before attempting deployment again

## Switching Between Vercel and Firebase

Both deployment options are configured in this project. To deploy to:
- Vercel: Use your existing Vercel workflow
- Firebase: Use the commands in this guide

This dual-deployment setup provides redundancy in case one platform experiences issues.