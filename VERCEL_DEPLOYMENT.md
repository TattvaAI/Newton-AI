# 🚀 Vercel Deployment Guide

## Newton-AI - Production Deployment

This guide walks you through deploying Newton-AI to Vercel.

---

## ✅ Pre-Deployment Checklist

All items below are **already completed**:

- [x] TypeScript build passes (`npm run build`)
- [x] Type checking passes (`npm run type-check`)
- [x] Production build tested locally (`npm run preview`)
- [x] Git repository pushed to GitHub
- [x] `.env.example` file included for reference
- [x] `vercel.json` configured with build settings
- [x] `.vercelignore` added to exclude unnecessary files

---

## 🌐 Deployment Methods

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TattvaAI/Newton-AI&env=VITE_GEMINI_API_KEY)

1. **Click the Deploy button** above
2. **Sign in to Vercel** (or create an account)
3. **Clone the repository** to your GitHub account
4. **Add Environment Variable**:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
5. **Click Deploy**
6. Wait ~2 minutes for build to complete
7. **Your app is live!** 🎉

### Option 2: GitHub Integration

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `TattvaAI/Newton-AI` repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
4. Add environment variable:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
5. Click **Deploy**

### Option 3: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account/team
# - Link to existing project? No (first time) / Yes (subsequent)
# - Project name: NewtonAI (or your preference)
# - Directory: ./ (default)

# Add environment variable via CLI
vercel env add VITE_GEMINI_API_KEY production
# Paste your API key when prompted

# Redeploy with environment variable
vercel --prod
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API Key | [Google AI Studio](https://makersuite.google.com/app/apikey) |

### Setting Environment Variables in Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `VITE_GEMINI_API_KEY`:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Your API key
   - **Environments**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy to apply changes

---

## 🔧 Build Configuration

The project uses the following Vercel configuration (`vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_GEMINI_API_KEY": "@vite_gemini_api_key"
  },
  "build": {
    "env": {
      "VITE_GEMINI_API_KEY": "@vite_gemini_api_key"
    }
  }
}
```

### Automatic Detection

Vercel automatically detects:
- ✅ Vite framework
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Node.js version (from `.nvmrc` or latest LTS)

---

## 🎯 Post-Deployment Steps

### 1. Verify Deployment

- Check that your site loads: `https://your-project.vercel.app`
- Test AI generation with a simple prompt
- Verify physics controls work
- Test saved simulations feature

### 2. Set Up Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `newton-ai.yoursite.com`)
3. Configure DNS records as shown
4. Wait for SSL certificate provisioning (~24 hours)

### 3. Configure Preview Deployments

- **Automatic**: Every pull request gets a preview URL
- **Branch deployments**: Configure in Settings → Git

### 4. Monitor Performance

- Check **Analytics** tab for usage stats
- Review **Functions** for serverless execution logs
- Monitor **Build Times** for optimization opportunities

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Type error: Cannot assign to 'angularVelocity' because it is a read-only property`

**Solution**: Already fixed in latest commit. Pull latest changes:
```bash
git pull origin main
```

### Environment Variable Not Working

**Symptoms**: "🔑 VITE_GEMINI_API_KEY is required" error

**Solutions**:
1. Ensure variable is set in Vercel Dashboard
2. Variable must be named exactly `VITE_GEMINI_API_KEY` (case-sensitive)
3. Redeploy after adding variables
4. Check **Deployments** → **Build Logs** for confirmation

### Build Takes Too Long

**Optimization**:
1. Enable caching in `vercel.json`:
   ```json
   {
     "github": {
       "silent": true
     }
   }
   ```
2. Clear Vercel cache: Settings → Clear Cache
3. Remove `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

### API Rate Limits

**Gemini Rate Limits**:
- **Flash**: 1,000 requests/day (15 RPM)
- **Pro**: 150 requests/day (2 RPM)

**Solutions**:
- Use Flash model for frequent testing
- Implement request caching (future feature)
- Request higher quota from Google AI Studio

---

## 📊 Deployment Checklist

Use this checklist for each deployment:

- [ ] All tests pass locally
- [ ] TypeScript compiles without errors
- [ ] Production build succeeds
- [ ] Environment variables configured
- [ ] Git changes committed and pushed
- [ ] Deployment succeeds on Vercel
- [ ] Live site loads correctly
- [ ] AI generation works
- [ ] Physics controls function properly
- [ ] Browser console has no errors
- [ ] Mobile responsive design verified

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you:
1. Push to `main` branch → Production deployment
2. Push to any branch → Preview deployment
3. Open a pull request → Preview deployment

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod --git-branch your-branch

# Deploy from local directory
vercel --prod

# Promote a preview to production
vercel promote <deployment-url>
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Google Gemini API](https://ai.google.dev/docs)
- [Newton-AI GitHub](https://github.com/TattvaAI/Newton-AI)

---

## 🎉 Success!

Your Newton-AI instance is now live! Share your deployment URL and start creating amazing physics simulations.

**Live Demo**: https://newton-ai-yourdomain.vercel.app

---

**Need Help?**
- Open an issue: [GitHub Issues](https://github.com/TattvaAI/Newton-AI/issues)
- Check discussions: [GitHub Discussions](https://github.com/TattvaAI/Newton-AI/discussions)

Built with ❤️ by [TattvaAI](https://github.com/TattvaAI)
