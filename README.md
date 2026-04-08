# Vaklab AI Website

React + Vite + React Router, deployed to Firebase Hosting.

## Routes

- `/` — Home (landing page)
- `/product` — Meet Sierra (product page)
- `/specialty/dentist` — Dentistry specialty
- `/specialty/urgent-care` — Urgent Care specialty
- `/specialty/mental-health` — Mental Health specialty
- `/specialty/fertility` — Fertility specialty
- `/specialty/orthopedics` — Orthopedics specialty

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Firebase

### Option 1: Manual deploy
```bash
npm run build
firebase deploy --only hosting
```

### Option 2: Via GitHub Actions (if CI/CD already set up)
```bash
git add .
git commit -m "Update site with React Router"
git push origin main
```

## First-time Firebase Setup (if needed)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select "dist" as public directory
# Select "Yes" for single-page app
# Select "No" for overwriting index.html
```

## Project Structure

```
vaklab-site/
├── public/
│   └── favicon.svg          # Stethoscope favicon
├── src/
│   ├── main.jsx             # React Router entry
│   └── App.jsx              # All pages & components
├── index.html               # Vite entry
├── package.json
├── vite.config.js
└── firebase.json            # SPA rewrites for React Router
```
