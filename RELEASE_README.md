# Regex Tester - Offline Edition v1.0.0

A simple, elegant regex testing tool with Ayu Mirage theme. Perfect for offline use and GitLab Pages hosting.

## 🌟 Features

- **Real-time regex testing** with live match highlighting
- **Pattern conversions** for grep, egrep, sed, and vim
- **Animated match counter** with visual feedback
- **Copy buttons** for easy pattern sharing
- **Ayu Mirage theme** for comfortable extended use
- **100% offline** - no external dependencies
- **Single file** - everything in one HTML file

## 🚀 Quick Start

### Option 1: Direct Browser
Simply open `index.html` in any modern web browser.

### Option 2: GitLab Pages

1. Create a new GitLab project
2. Upload these files:
   - `index.html`
   - `.gitlab-ci.yml`
3. Push to main branch
4. Access at: `https://yourusername.gitlab.io/yourproject`

### Option 3: GitHub Pages

1. Create a new GitHub repository
2. Upload `index.html`
3. Go to Settings → Pages
4. Source: Deploy from branch (main)
5. Access at: `https://yourusername.github.io/yourrepo`

### Option 4: Local Web Server

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# Then open http://localhost:8000
```

## 📦 What's Included

- `index.html` - The complete application (no other files needed!)
- `.gitlab-ci.yml` - GitLab Pages deployment configuration
- `RELEASE_README.md` - This file

## 🎨 Features Guide

### Regex Input
- Enter your pattern in the first input
- Add flags (g, i, m) in the small box next to it
- See matches highlighted in real-time

### Pattern Conversions
- Automatically shows how to use your pattern in:
  - **grep** - Basic command line search
  - **egrep** - Extended grep
  - **sed** - Stream editor
  - **vim** - Text editor search
- Click "Copy" to copy any conversion

### Match Counter
- Shows number of matches found
- Pulses with golden animation when count changes

### Quick Reference
- Common regex patterns at the bottom
- Helpful for beginners and quick reminders

## 🛠️ Technical Details

- **No build process** - Just HTML, CSS, and JavaScript
- **No dependencies** - Everything is self-contained
- **Browser support** - Chrome, Firefox, Safari, Edge (all modern versions)
- **File size** - ~40KB (single file)
- **Theme** - Ayu Mirage (dark theme with yellow accents)

## 🔒 Privacy & Security

- **100% client-side** - No data is sent anywhere
- **No tracking** - No analytics or cookies
- **No external resources** - Fonts use system defaults
- **Safe for sensitive data** - Everything stays in your browser

## 📝 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

This is a simple tool meant to stay simple. If you have ideas for improvements while maintaining the single-file, offline nature, feel free to contribute!

---

**Version:** 1.0.0  
**Released:** 2024  
**Theme:** Ayu Mirage  
**Status:** Production Ready