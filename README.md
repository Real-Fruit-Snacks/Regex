# Regex Tester - Multi-Mode Regular Expression Testing Tool

A powerful, browser-based regex tester that supports multiple regex flavors including JavaScript, PCRE, grep, egrep, Vim, Python, and sed. Test your patterns with real-time highlighting, detailed match information, and helpful mode-specific guidance.

![Regex Tester](https://img.shields.io/badge/regex-tester-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Themes](https://img.shields.io/badge/themes-14-purple)
![Modes](https://img.shields.io/badge/modes-7-orange)

## Features

### 🎯 Multiple Regex Modes
- **JavaScript (ECMAScript)** - Full ES2018+ support including lookbehinds, named groups, and Unicode properties
- **PCRE (Perl Compatible)** - Inline modifiers, possessive quantifiers, and advanced features with clear warnings
- **grep (BRE)** - Basic Regular Expressions with proper escaping rules
- **egrep (ERE)** - Extended Regular Expressions with intuitive syntax
- **Vim/Vi** - Complete support for magic modes (\v, \m, \M, \V) and Vim-specific syntax
- **Python** - Python's re module syntax with named groups and inline modifiers
- **sed** - Stream editor patterns using BRE syntax

### 🎨 Beautiful Themes
14 carefully crafted themes to suit your preference:
- Light themes: Default, Light, Ayu Light, Solarized
- Dark themes: Dark, Monokai, Dracula, One Dark, Nord, Gruvbox Dark, Tokyo Night, Catppuccin Mocha, Ayu Dark, Ayu Mirage

### ✨ Key Features
- **Real-time matching** with syntax highlighting
- **Match count** and detailed match information
- **Group capture** display with positions
- **Error messages** with helpful suggestions
- **Mode-specific help** with examples and common patterns
- **Flag support** with mode-appropriate validation
- **Pattern transformation** between different regex flavors
- **Responsive design** that works on all devices

### 🚀 New Enhanced Features
- **Syntax Highlighting** - Color-coded regex components in the pattern input
- **Pattern Explanation** - Hierarchical breakdown of your regex with plain English descriptions
- **Enhanced Tooltips** - Hover over any regex component for detailed help and examples
- **Live Replacement Preview** - See replacements in real-time with capture group support
- **Pattern Library** - 40+ common patterns with one-click usage and custom pattern saving

## Quick Start

### Option 1: Use Online (GitHub Pages / GitLab Pages)
Visit the live demo:
- GitHub Pages: `https://[your-username].github.io/regex-tester`
- GitLab Pages: `https://[your-username].gitlab.io/regex-tester`

### Option 2: Direct Browser Access
Simply open `index.html` in your web browser.

### Option 3: Local Server
```bash
# Clone the repository
git clone https://github.com/yourusername/regex-tester.git
cd regex-tester

# Start a local server (Python 3)
python3 -m http.server 8000

# Or using npm
npm start

# Open in browser
# Navigate to http://localhost:8000
```

## Usage

1. **Select a regex mode** from the dropdown menu
2. **Enter your pattern** in the regex input field
3. **Add flags** if needed (e.g., g for global, i for case-insensitive)
4. **Type or paste test text** in the text area
5. **View matches** highlighted in real-time with match count and details

### Mode-Specific Examples

#### JavaScript
```javascript
// Named capture groups
(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})

// Lookarounds
\d+(?=px)  // positive lookahead
(?<=\$)\d+ // positive lookbehind
```

#### PCRE
```perl
// Inline modifiers
(?i)case insensitive
(?m)^multiline$

// Possessive quantifiers (with warning)
\w++
```

#### grep (BRE)
```bash
# Escaped special characters
\(group\)
[0-9]\+
cat\|dog
```

#### Vim
```vim
# Magic modes
\v(very)+(magic)   " very magic
\chello            " case insensitive
\<word\>           " word boundaries
```

## Pattern Transformations

The tool automatically transforms patterns between different regex flavors:

- **BRE → JavaScript**: Converts `\(` `\)` to `(` `)`, `\+` to `+`, etc.
- **Python → JavaScript**: Converts `(?P<name>)` to `(?<name>)`, handles `(?P=name)`
- **PCRE → JavaScript**: Extracts inline modifiers, warns about unsupported features
- **Vim → JavaScript**: Handles magic modes, converts `\<` `\>` to `\b`

## Supported Flags

### JavaScript
- `g` - global
- `i` - ignoreCase  
- `m` - multiline
- `s` - dotAll
- `u` - unicode
- `y` - sticky
- `v` - unicodeSets

### Other Modes
Each mode supports appropriate flags with validation and helpful warnings when flags are not applicable.

## Browser Compatibility

Works in all modern browsers that support ES2018+ features:
- Chrome/Edge 70+
- Firefox 78+
- Safari 12+

## Project Structure

```
regex-tester/
├── index.html      # Main application HTML
├── app.js          # Core regex testing logic
├── mode-help.js    # Mode-specific help content
├── package.json    # Project metadata
└── themes/         # 14 theme stylesheets
```

## Deployment

### GitHub Pages
1. Push your code to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` (or `master`) branch and `/ (root)` folder
5. Click Save
6. Your site will be available at `https://[username].github.io/regex-tester`

### GitLab Pages
1. Push your code to GitLab (`.gitlab-ci.yml` is already configured)
2. The site will automatically deploy on push to main/master branch
3. Your site will be available at `https://[username].gitlab.io/regex-tester`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Maintain compatibility with existing regex modes
2. Ensure new features work across all themes
3. Add appropriate error handling and user feedback
4. Update help documentation for new features

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various online regex testers
- Theme designs inspired by popular code editor themes
- Built with vanilla JavaScript for maximum compatibility

---

Made with ❤️ for the regex community