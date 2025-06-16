# 🎉 Regex Tester v2.0.0 - Major Release

## 🚀 Offline GitLab Deployment Package

This release includes a complete offline deployment package specifically designed for GitLab repositories and self-hosted environments.

## 📦 Download Options

- **`regex-tester-v2.0.0-offline.tar.gz`** - Complete package (tar.gz format)
- **`regex-tester-v2.0.0-offline.zip`** - Complete package (zip format)

Both archives contain identical content - choose based on your platform preference.

## ✨ What's New in v2.0.0

### 🎯 Enhanced Features
1. **Real-time Syntax Highlighting** - Color-coded regex components as you type
2. **Pattern Explanation Panel** - Understand your regex with plain English breakdowns
3. **Interactive Tooltips** - Hover over any regex component for detailed help
4. **Live Replacement Preview** - See replacements before applying them
5. **Pattern Library** - 40+ common patterns with one-click usage
6. **Custom Pattern Saving** - Save your frequently used patterns

### 🎨 Design Improvements
- Consistent design language across all features
- Smooth transitions and animations
- Improved hover states and interactions
- Better visual hierarchy

### 🛠️ Technical Enhancements
- Complete regex parser with AST generation
- Support for all 7 regex modes in new features
- Enhanced error handling and recovery
- Improved performance with debounced updates

## 📋 Package Contents

```
regex-tester-v2.0.0/
├── Core Application Files
│   ├── index.html
│   ├── app.js
│   ├── mode-help.js
│   ├── regex-parser.js
│   ├── syntax-highlighter.js
│   ├── pattern-explainer.js
│   ├── enhanced-tooltips.js
│   ├── replacement-preview.js
│   └── pattern-library.js
├── Themes (14 total)
│   └── themes/*.css
├── Assets
│   ├── favicon.ico, favicon.svg
│   └── favicon-*.png (multiple sizes)
├── Configuration
│   ├── .gitlab-ci.yml (GitLab Pages deployment)
│   ├── manifest.json (PWA support)
│   └── package.json
└── Documentation
    ├── README.md
    ├── OFFLINE_DEPLOYMENT.md
    └── LICENSE
```

## 🔧 Deployment Options

### GitLab Pages (Recommended)
1. Create new GitLab repository
2. Upload package contents
3. GitLab automatically deploys via included `.gitlab-ci.yml`
4. Access at `https://[username].gitlab.io/[repo-name]`

### Direct File Access
- Simply open `index.html` in any browser
- No server required
- 100% offline functionality

### Local Server
```bash
python3 -m http.server 8000
# or
npx http-server
```

## 🌟 Key Features

### Regex Modes Supported
- JavaScript (ECMAScript 2018+)
- PCRE (Perl Compatible)
- grep (Basic Regular Expressions)
- egrep (Extended Regular Expressions)
- Vim/Vi
- Python (re module)
- sed

### Theme Collection (14 themes)
Light: Default, Light, Ayu Light, Solarized  
Dark: Dark, Monokai, Dracula, One Dark, Nord, Gruvbox Dark, Tokyo Night, Catppuccin Mocha, Ayu Dark, Ayu Mirage

## 💯 Offline Capabilities

- **No CDN Dependencies** - All resources included
- **No External API Calls** - Complete privacy
- **No Analytics/Tracking** - Your data stays with you
- **Works Without Internet** - Full functionality offline
- **Self-Contained** - No installation or setup required

## 📊 Compatibility

### Browsers
- Chrome/Edge 70+
- Firefox 78+
- Safari 12+
- Opera (latest)

### Platforms
- Windows (all versions)
- macOS (10.12+)
- Linux (all distributions)
- Corporate networks
- Air-gapped environments

## 🔐 Security

- No external dependencies
- No data transmission
- Local storage only
- CSP headers ready
- ISC licensed (permissive)

## 📝 Migration from v1.x

No migration needed! Simply replace old files with new package. All existing bookmarks and direct links continue to work.

## 🐛 Bug Fixes

- Fixed initialization errors in feature modules
- Improved error handling for invalid patterns
- Better memory management for large texts
- Enhanced mobile responsiveness

## 📚 Documentation

Comprehensive documentation included:
- `README.md` - General usage and features
- `OFFLINE_DEPLOYMENT.md` - Detailed deployment scenarios
- In-app help for each regex mode

## 🙏 Acknowledgments

Thanks to all users who provided feedback for v1.0. This release addresses the most requested features for learning and understanding regular expressions.

---

**Download Now and Start Testing Regex Offline!**

For issues or questions, please check the documentation included in the package.