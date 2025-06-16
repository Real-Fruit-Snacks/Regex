# Regex Tester - Offline GitLab Deployment Package

This is a complete offline package of the Regex Tester v2.0.0 application with enhanced features.

## 🚀 Quick Start

### Option 1: GitLab Pages Deployment (Recommended)

1. Create a new GitLab repository
2. Upload all files from this package to the repository
3. GitLab will automatically deploy to Pages using the included `.gitlab-ci.yml`
4. Access your app at: `https://[username].gitlab.io/[repo-name]`

### Option 2: Direct File Access

Simply open `index.html` in any modern web browser. No server required!

### Option 3: Local Web Server

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if available)
npx http-server

# Then navigate to http://localhost:8000
```

## 📦 Package Contents

```
regex-tester-v2.0.0/
├── index.html              # Main application file
├── app.js                  # Core application logic
├── mode-help.js           # Mode-specific help content
├── regex-parser.js        # Regex parsing engine
├── syntax-highlighter.js  # Pattern syntax highlighting
├── pattern-explainer.js   # Pattern explanation feature
├── enhanced-tooltips.js   # Interactive tooltips
├── replacement-preview.js # Live replacement preview
├── pattern-library.js     # Common patterns library
├── themes/               # 14 color themes
│   ├── default.css
│   ├── dark.css
│   ├── monokai.css
│   └── ... (11 more themes)
├── favicon.ico           # Browser favicon
├── favicon.svg           # SVG favicon
├── favicon-*.png         # Various favicon sizes
├── manifest.json         # Web app manifest
├── package.json          # Package metadata
├── .gitlab-ci.yml        # GitLab CI/CD configuration
└── README.md            # This file
```

## ✨ Features

- **7 Regex Modes**: JavaScript, PCRE, grep, egrep, Vim, Python, sed
- **14 Beautiful Themes**: From light to dark, including popular editor themes
- **Enhanced Features**:
  - Real-time syntax highlighting
  - Pattern explanations in plain English
  - Interactive hover tooltips
  - Live replacement preview
  - 40+ common patterns library
  - Custom pattern saving

## 🛠️ GitLab Setup Instructions

### 1. Create New Repository

```bash
# Clone your new GitLab repository
git clone https://gitlab.com/[username]/regex-tester.git
cd regex-tester

# Copy all files from this package
cp -r /path/to/regex-tester-v2.0.0/* .
cp /path/to/regex-tester-v2.0.0/.gitlab-ci.yml .

# Commit and push
git add .
git commit -m "Initial commit - Regex Tester v2.0.0"
git push origin main
```

### 2. Enable GitLab Pages

1. Go to Settings → Pages in your GitLab project
2. Pages should automatically be enabled after first pipeline run
3. Find your Pages URL (usually `https://[username].gitlab.io/regex-tester`)

### 3. Custom Domain (Optional)

1. Go to Settings → Pages
2. Click "New Domain"
3. Enter your custom domain
4. Follow DNS configuration instructions

## 🔧 Configuration

### Modify Default Theme

Edit line 19 in `index.html`:
```html
<link rel="stylesheet" href="themes/default.css" id="theme-stylesheet">
```

### Modify Default Regex Mode

Edit line 136 in `index.html`:
```html
<input type="hidden" id="regex-mode" value="javascript">
```

### Add Custom Patterns

Patterns are saved in browser localStorage. To pre-populate custom patterns, modify `pattern-library.js`.

## 🌐 Browser Compatibility

- Chrome/Edge 70+
- Firefox 78+
- Safari 12+
- All modern browsers with ES2018+ support

## 📱 Mobile Support

The application is fully responsive and works on:
- Tablets (iPad, Android tablets)
- Large phones (iPhone Plus/Max, Android)
- Basic mobile support for smaller devices

## 🔒 Security & Privacy

- **100% Offline**: No external dependencies or API calls
- **No Tracking**: Zero analytics or tracking code
- **Local Storage Only**: All data stays in the browser
- **No CDN Dependencies**: All resources included

## 🐛 Troubleshooting

### Application Not Loading
- Ensure all files were copied (especially the `themes` folder)
- Check browser console for errors
- Try a different browser

### GitLab Pages Not Working
- Check pipeline status in CI/CD → Pipelines
- Ensure `.gitlab-ci.yml` is in the root directory
- Verify Pages is enabled in Settings

### Themes Not Loading
- Verify `themes` folder contains all 14 CSS files
- Check browser console for 404 errors

## 📄 License

This project is licensed under the ISC License. See package.json for details.

## 🤝 Support

For issues or questions:
1. Check the browser console for errors
2. Verify all files are present
3. Try clearing browser cache
4. Test in incognito/private mode

---

**Regex Tester v2.0.0** - A powerful, offline regex testing tool with enhanced learning features.