# Quick Deployment Fix

## Step 1: Clean Install (Run this first!)
```bash
cd ai-workflow-builder/client
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Step 2: Test Locally
```bash
npm start
```
Should work at http://localhost:3000

## Step 3: Deploy to Vercel
1. Push your code to GitHub
2. Go to https://vercel.com/
3. Import your repository
4. Set root directory to: `client`
5. Deploy!

## Step 4: Backend (Render)
1. Go to https://render.com/
2. Create new Web Service
3. Set root directory to: `server`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Add environment variables:
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - `OPENAI_API_KEY=your_key`
   - `GEMINI_API_KEY=your_key`
   - `SERPAPI_API_KEY=your_key`

## Troubleshooting
- If you get dependency errors, run the clean install again
- Make sure you're in the `client` directory when running npm commands
- Check that all environment variables are set in Vercel/Render 