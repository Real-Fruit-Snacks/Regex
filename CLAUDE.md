# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RegexPro is a professional cybersecurity-focused regex testing application built with vanilla JavaScript. Originally a basic regex tester, it has been transformed into a professional-grade tool specifically designed for the cybersecurity community, CTF competitions, and security research.

## Key Architecture Components

### Core Application Structure
- **`app.js`** - Main `RegexTester` class with caching, security, and performance optimizations
- **`cyber-patterns.js`** - Cybersecurity-specific pattern library with 50+ patterns across 7 categories
- **`enhanced-pattern-library.js`** - Pattern management with search, recent patterns, and export
- **`keyboard-shortcuts.js`** - Power user shortcuts and URL parameter handling
- **`index.html`** - Professional cybersecurity-themed UI with sidebar navigation

### Pattern Library Architecture
The application includes 7 specialized pattern categories:
- **Network**: IPv4/IPv6, MAC addresses, CIDR notation, ports
- **Security**: Hashes (MD5, SHA-1, SHA-256), JWT tokens, Base64
- **Web**: XSS detection, SQL injection patterns, HTTP headers  
- **Forensics**: File paths, registry keys, process IDs
- **Logs**: Apache logs, syslog entries, timestamps
- **Malware**: Hex strings, PE headers, suspicious processes
- **CTF**: Flag formats, encodings, hex dumps

### Security & Performance Features
The codebase includes enterprise-grade security and performance optimizations:
- **XSS Protection**: Input sanitization, HTML escaping, pattern validation
- **DoS Prevention**: Infinite loop protection, ReDoS detection, iteration limits
- **Memory Management**: Event listener cleanup, DOM/regex caching, proper teardown
- **Error Handling**: Centralized error management with recovery mechanisms

## Development Commands

### Local Development
```bash
# Start local server (primary method)
npm start

# Alternative methods
python3 -m http.server 8000
python -m SimpleHTTPServer 8000  # Python 2
npx http-server
```

### Testing
```bash
# Open test suites in browser
open test-all-fixes.html           # Comprehensive test suite  
open instant-verify.js             # Quick verification (copy to console)
open test-features.html            # Feature testing
open test-offline.html             # Offline functionality test

# Manual testing
open manual-test-checklist.html    # Interactive checklist
```

### Deployment
The application deploys automatically to GitLab Pages via `.gitlab-ci.yml`. No build process required - it's a static site.

## Code Organization

### Main Classes
- **`RegexTester`** - Core application with DOM caching, regex caching, event management
- **`EnhancedPatternLibrary`** - Pattern search, categorization, recent patterns
- **`KeyboardShortcuts`** - Hotkey handling, URL parameter processing
- **`CyberPatterns`** - Static pattern definitions with cybersecurity focus

### Performance Optimizations
- **Regex Caching**: LRU cache for compiled regex objects (100-entry limit)
- **DOM Caching**: Element reference caching to avoid repeated queries  
- **Event Tracking**: All event listeners tracked for proper cleanup
- **Memory Management**: Comprehensive cleanup methods in all classes

### Security Measures
- **Input Validation**: `validateRegexPattern()`, `sanitizeInput()`, URL parameter validation
- **XSS Prevention**: HTML escaping, script detection, protocol filtering
- **DoS Protection**: Iteration limits, complexity analysis, safe execution wrappers
- **Error Recovery**: Automatic recovery from error states, graceful degradation

## Critical Implementation Details

### Event Listener Management
All event listeners must be tracked via `addEventListenerTracked()` method for proper cleanup. The application includes automatic cleanup on page unload and visibility change.

### Theme System
15 themes with CSS variables. Default is `cyber-pro` theme. Theme switching is handled via dropdown with localStorage persistence.

### Multi-Mode Regex Support
Supports 7 regex modes with pattern transformation:
- JavaScript (default), PCRE, Python, grep/egrep, Vim, sed
- Each mode has specific flag validation and help content

### Pattern Integration
New patterns should be added to `cyber-patterns.js` following the existing structure:
```javascript
{
    name: 'Pattern Name',
    pattern: 'regex_pattern',
    description: 'What it matches',
    example: 'sample_match'
}
```

## Testing Strategy

The codebase includes comprehensive testing:
- **Unit Testing**: Pattern matching, validation, caching
- **Security Testing**: XSS attempts, DoS patterns, injection tests
- **Performance Testing**: Large input handling, regex complexity
- **Integration Testing**: Full user workflow verification

When adding features, ensure tests cover security implications and performance impact.

## Offline Functionality

The application is designed to work completely offline after initial load:
- No external API dependencies
- All resources bundled locally  
- Font fallbacks for offline use
- Service worker ready (PWA capable)

This is critical for air-gapped security environments and CTF competitions.