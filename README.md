# FailSafe AI - Landing Page

> Modern landing page for FailSafe AI production optimization system
> Part of Hackathon dla Małopolski 2025

## 🚀 Quick Start

### Local Development
```bash
# Serve with Python
python -m http.server 8000

# Open browser
http://localhost:8000/app/index.html
```

### Deploy to GitHub Pages
1. Push to `gh-pages` branch
2. Enable GitHub Pages in repo settings
3. Live at: `https://username.github.io/failsafe-landing-repo`

## 📁 Structure

```
app/
├── index.html          # Main landing page
├── demo.html           # Interactive demo (requires backend)
└── static/
    ├── css/
    │   ├── landing.css
    │   └── demo.css
    └── js/
        ├── landing.js
        └── demo.js
```

## 🎨 Features

- ✨ Animated particles background
- 📊 Interactive ROI calculator
- 🤖 AI algorithm visualization
- 👥 Team showcase with LinkedIn QR codes
- 📧 Contact form (requires backend)
- 📱 Fully responsive design
- 🌙 Dark techno theme with neon accents

## 🔗 Backend Integration

For full functionality (contact form, demo), requires:
- Backend API at `http://localhost:8000` or deployed server
- Endpoints: `/api/contact`, `/api/reschedule`, `/api/production`

See main [FailSafe project](https://github.com/NetBr3ak/failsafe) for backend setup.

## 🛠️ Tech Stack

- HTML5
- CSS3 (custom animations)
- JavaScript (vanilla)
- Particles.js (background)
- AOS (scroll animations)

## 📜 License

Hackathon dla Małopolski 2025 - Grupa 5
