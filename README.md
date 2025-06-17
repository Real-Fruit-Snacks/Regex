# Regex Tester

A simple, elegant regex testing tool with Ayu Mirage theme.

![Version](https://img.shields.io/github/v/release/Real-Fruit-Snacks/Regex?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Size](https://img.shields.io/badge/size-40KB-blue?style=flat-square)

## ✨ Features

- 🎯 **Real-time Testing** - See matches highlighted instantly as you type
- 🔄 **Pattern Conversions** - Convert patterns for grep, egrep, sed, and vim
- 📊 **Animated Counter** - Visual feedback when match count changes
- 📋 **Copy Buttons** - One-click copy for conversion patterns
- 🎨 **Ayu Mirage Theme** - Beautiful dark theme with yellow accents
- 📦 **Single File** - Everything in one HTML file (40KB)
- 🔒 **100% Offline** - No external dependencies or tracking

## 🚀 Quick Start

### Download Latest Release
[![Download](https://img.shields.io/badge/Download-v1.1.0-ffcc66?style=for-the-badge)](https://github.com/Real-Fruit-Snacks/Regex/releases/latest)

### Use Online
- Open `index.html` in any modern web browser
- Or visit the [live demo](https://real-fruit-snacks.github.io/Regex/) (if available)

### Deploy to GitLab Pages
1. Download the [latest release](https://github.com/Real-Fruit-Snacks/Regex/releases/latest)
2. Extract files to your GitLab repository
3. Push to main branch
4. Access at `https://yourusername.gitlab.io/yourproject`

## 📸 Screenshot

<img width="800" alt="Regex Tester Screenshot" src="https://user-images.githubusercontent.com/placeholder/regex-tester-screenshot.png">

## 🎯 Usage

1. **Enter Pattern** - Type your regex in the first input field
2. **Add Flags** - Use g (global), i (case-insensitive), m (multiline)
3. **Test Text** - Enter text to test against your pattern
4. **See Results** - Matches are highlighted in yellow
5. **Copy Conversions** - Click "Copy" buttons to use patterns in other tools

### Example Patterns

```regex
\d+                    # Match numbers
\b\w+@\w+\.\w+\b      # Simple email
^[A-Z][a-z]+          # Capitalized words
\b(?:TODO|FIXME)\b    # Code comments
```

## 🛠️ Pattern Conversions

The tool automatically shows how to use your pattern in different tools:

| Tool | Example | Notes |
|------|---------|-------|
| **grep** | `grep -i 'pattern'` | Basic regex, needs backslashes |
| **egrep** | `egrep 'pattern'` | Extended regex, more like JavaScript |
| **sed** | `s/pattern/replacement/g` | Stream editor format |
| **vim** | `/pattern/gi` | Vim search with flags |

## 🔧 Technical Details

- **No Build Process** - Just HTML, CSS, and JavaScript
- **No Dependencies** - Everything is self-contained
- **Browser Support** - Chrome, Firefox, Safari, Edge (all modern versions)
- **Responsive** - Works on desktop and mobile
- **Accessible** - Proper contrast ratios and keyboard navigation

## 📦 Installation

### Option 1: Download
Download the latest release and open `index.html` in your browser.

### Option 2: Clone
```bash
git clone https://github.com/Real-Fruit-Snacks/Regex.git
cd Regex
# Open index.html in your browser
```

### Option 3: Local Server
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server

# Then visit http://localhost:8000
```

## 🤝 Contributing

This tool is intentionally kept simple. If you'd like to contribute:

1. Keep the single-file architecture
2. Maintain offline functionality
3. Preserve the Ayu Mirage theme
4. Test in multiple browsers

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Theme: [Ayu](https://github.com/ayu-theme/ayu-colors)
- Inspiration: Various online regex testers
- Built with vanilla JavaScript for simplicity

---

Made with 💛 using the Ayu Mirage theme