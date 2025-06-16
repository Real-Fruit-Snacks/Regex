# RegexPro - Professional Cybersecurity Regex Testing Suite

## Overview
RegexPro is a professionally redesigned regex testing application tailored for the cybersecurity community. Built for CTF competitions, penetration testing, log analysis, and security research.

## 🚀 Key Features

### Professional Cybersecurity UI
- **Modern Dark Theme**: Terminal-inspired design with matrix-green accents
- **Professional Layout**: Sidebar navigation with quick access to patterns
- **Enhanced Typography**: JetBrains Mono for code, Inter for UI text
- **Responsive Design**: Works flawlessly on all screen sizes

### Cybersecurity Pattern Library
- **Network Patterns**: IPv4/IPv6, MAC addresses, CIDR notation, ports
- **Security Patterns**: Hashes (MD5, SHA-1, SHA-256), JWT tokens, Base64
- **Web Security**: XSS detection, SQL injection patterns, HTTP headers
- **Forensics**: File paths, registry keys, process IDs
- **Log Analysis**: Apache logs, syslog entries, timestamps
- **Malware Analysis**: Hex strings, PE headers, suspicious processes
- **CTF Patterns**: Flag formats, encodings, hex dumps

### Power User Features
- **Keyboard Shortcuts**: 
  - `Ctrl+/` - Show shortcuts
  - `F1` - Help panel
  - `Ctrl+P` - Focus pattern
  - `Ctrl+T` - Focus test string
  - `Ctrl+E` - Export pattern
  - `Ctrl+S` - Share pattern
  - `F3` - Next/previous match navigation
- **Recent Patterns**: Quick access to previously used patterns
- **Pattern Export/Share**: Export patterns as JSON or share via URL
- **Live Character Count**: Track input size and line count
- **Status Bar**: Real-time mode and status information

### Enhanced Functionality
- **Multi-Mode Support**: JavaScript, PCRE, Python, grep/egrep, Vim, sed
- **Sample Data**: Pre-loaded cybersecurity test data for each category
- **URL Parameters**: Share patterns via URL query parameters
- **Offline Ready**: Works completely offline after initial load
- **PWA Support**: Install as a desktop application

## 🌐 Deployment

### GitLab Pages
The application is configured for automatic deployment to GitLab Pages:
1. Push to your GitLab repository
2. The `.gitlab-ci.yml` file handles automatic deployment
3. Access at: `https://username.gitlab.io/repository-name/`

### Local Testing
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

## 🛡️ Security & Privacy
- **100% Offline**: No data is sent to external servers
- **No Analytics**: Complete privacy, no tracking
- **Local Storage Only**: Patterns saved locally in browser
- **Open Source**: Fully auditable codebase

## 📋 Browser Support
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- All modern mobile browsers

## 🎨 Themes
- **Cyber Pro** (Default): Professional cybersecurity theme
- **Ayu Mirage**: Modern medium contrast
- **Dracula**: Popular dark theme
- **Nord**: Arctic-inspired colors
- Plus 10+ additional themes

## 💡 Usage Tips
1. Use the pattern library sidebar to quickly access common cybersecurity patterns
2. Press `Ctrl+/` to see all keyboard shortcuts
3. Click pattern cards to instantly load them
4. Recent patterns are saved automatically
5. Share patterns with teammates using the share button

## 🔧 Technical Stack
- Pure JavaScript (no frameworks)
- CSS3 with CSS Variables
- HTML5 with semantic markup
- PWA manifest for installability
- GitLab CI/CD for deployment

## 📄 License
Same as original Regex Tester - Open source for the community

## 🙏 Credits
Built on top of the excellent Regex Tester v2.0.0 with enhancements specifically for cybersecurity professionals.