#!/bin/bash

# Create release script for Regex Tester
VERSION="1.0.0"
RELEASE_NAME="regex-tester-v$VERSION"

echo "🚀 Creating Regex Tester Release v$VERSION"

# Create release directory
mkdir -p "release/$RELEASE_NAME"

# Copy essential files
echo "📋 Copying files..."
cp index.html "release/$RELEASE_NAME/"
cp .gitlab-ci.yml "release/$RELEASE_NAME/"
cp RELEASE_README.md "release/$RELEASE_NAME/README.md"

# Create a minimal package.json for npm users
cat > "release/$RELEASE_NAME/package.json" << EOF
{
  "name": "regex-tester-offline",
  "version": "$VERSION",
  "description": "Simple offline regex tester with Ayu Mirage theme",
  "main": "index.html",
  "scripts": {
    "start": "python3 -m http.server 8000 || python -m SimpleHTTPServer 8000"
  },
  "keywords": ["regex", "tester", "offline", "gitlab-pages"],
  "license": "MIT"
}
EOF

# Create deployment instructions
cat > "release/$RELEASE_NAME/DEPLOY.md" << EOF
# Deployment Instructions

## GitLab Pages
1. Create new GitLab project
2. Upload all files from this folder
3. Push to main branch
4. GitLab Pages will automatically deploy

## Local Testing
\`\`\`bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js  
npx http-server

# Option 3: Direct
Open index.html in your browser
\`\`\`

## Verification
- Check that match highlighting works
- Test pattern conversions
- Verify copy buttons function
- Ensure offline functionality
EOF

# Create checksums
cd release
echo "🔒 Creating checksums..."
find "$RELEASE_NAME" -type f -exec sha256sum {} \; > "$RELEASE_NAME.sha256"

# Create archives
echo "📦 Creating archives..."
tar -czf "$RELEASE_NAME.tar.gz" "$RELEASE_NAME"
zip -qr "$RELEASE_NAME.zip" "$RELEASE_NAME"

# Create release notes
cat > "RELEASE_NOTES_v$VERSION.md" << EOF
# Release Notes - Regex Tester v$VERSION

## 🎉 What's New

### Features
- **Simplified Architecture** - Single HTML file contains everything
- **Ayu Mirage Theme** - Beautiful dark theme with yellow accents
- **Live Pattern Testing** - Real-time regex matching with highlighting
- **Pattern Conversions** - See your pattern in grep, egrep, sed, and vim formats
- **Animated Match Counter** - Visual feedback when matches change
- **Copy Buttons** - One-click copy for conversion patterns
- **Offline Ready** - No external dependencies, works without internet

### Improvements
- Removed all complex features for simplicity
- Optimized for GitLab Pages deployment
- Added proper flag handling in conversions
- Improved error messages
- Better mobile responsiveness

## 📦 Files Included
- \`index.html\` - The complete application
- \`.gitlab-ci.yml\` - GitLab Pages configuration
- \`README.md\` - Documentation
- \`DEPLOY.md\` - Deployment instructions
- \`package.json\` - For npm/node users

## 🚀 Deployment
See DEPLOY.md for detailed instructions.

## 🔧 Technical Details
- Size: ~40KB (uncompressed)
- Dependencies: None
- Browser Support: All modern browsers
- Framework: Vanilla JavaScript
- Theme: Ayu Mirage

## 🐛 Bug Fixes
- Fixed pattern conversion flag handling
- Fixed copy button text escaping
- Improved match counting accuracy

---
Released: $(date +"%Y-%m-%d")
EOF

cd ..

echo "✅ Release created successfully!"
echo ""
echo "📁 Release files:"
echo "  - release/$RELEASE_NAME.tar.gz"
echo "  - release/$RELEASE_NAME.zip" 
echo "  - release/$RELEASE_NAME.sha256"
echo "  - release/RELEASE_NOTES_v$VERSION.md"
echo ""
echo "📤 Next steps:"
echo "  1. Test the release locally"
echo "  2. Create GitHub release and upload archives"
echo "  3. Tag the release: git tag -a v$VERSION -m 'Release v$VERSION'