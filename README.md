# BankProX - Frontend (Angular 20)

Modern, ultra-responsive digital banking frontend built with Angular 20 standalone components, Tailwind CSS, and full Atlantis theme parity.

## Live Backend Configuration
The frontend is already configured to speak directly with the live Render backend:
- **Backend API URL**: `https://backend-zpue.onrender.com/api`
- Configured in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

## Vercel Deployment

This folder includes [vercel.json](file:///C:/xampp/htdocs/bankproX-frontend/vercel.json) pre-configured with SPA route rewrites:

```json
{
  "framework": "angular",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/frontend/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Steps to Deploy to Vercel:
1. Initialize a Git repository and push this folder to your GitHub:
   ```bash
   cd C:\xampp\htdocs\bankproX-frontend
   git init
   git add .
   git commit -m "Initial commit of BankProX Angular frontend"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USER>/bankprox-frontend.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `bankprox-frontend` repository.
4. Framework Preset will be automatically detected as **Angular**. Click **Deploy**!

## Local Development
```bash
npm install
npm start
# Runs on http://localhost:4206
```
