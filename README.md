# Vaklab AI Website

## Project Structure
```
vaklabai-website/
├── public/
│   └── index.html        ← your website
├── .github/
│   └── workflows/
│       ├── firebase-deploy.yml   ← auto deploy on push to main
│       └── firebase-preview.yml  ← preview URL on pull request
├── firebase.json
├── .firebaserc
└── .gitignore
```

## One-Time Setup (do this once)

### 1. Install Node.js
Download from https://nodejs.org and install the LTS version.

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3. Login to Firebase
```bash
firebase login
```

### 4. Create Firebase project
- Go to https://console.firebase.google.com
- Click "Add project" → name it "vaklabai-site"
- Disable Google Analytics (not needed) → Create

### 5. Get Firebase Service Account for GitHub Actions
- In Firebase Console → Project Settings → Service Accounts
- Click "Generate new private key" → Download JSON file
- Go to your GitHub repo → Settings → Secrets and variables → Actions
- Click "New repository secret"
- Name: FIREBASE_SERVICE_ACCOUNT
- Value: paste the entire contents of the downloaded JSON file
- Click "Add secret"

### 6. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vaklabai-website.git
git push -u origin main
```

GitHub Actions will automatically deploy to Firebase. ✅

## Updating the Site

Every time you make changes:
```bash
git add .
git commit -m "describe your change"
git push
```

Site updates automatically in ~30 seconds. ✅

## Connect vaklabai.com Domain

1. Go to Firebase Console → Hosting → Add custom domain
2. Enter: vaklabai.com
3. Add the TXT and A records shown to Namecheap Advanced DNS
4. SSL certificate provisions automatically

## Local Preview (optional)
```bash
firebase serve
```
Opens at http://localhost:5000
