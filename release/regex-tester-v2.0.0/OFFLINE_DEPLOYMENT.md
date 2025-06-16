# Offline Deployment Guide

This guide covers various methods to deploy the Regex Tester in completely offline environments.

## 🖥️ Standalone Deployment (No Server)

### Direct File Access
1. Extract all files to a local directory
2. Open `index.html` directly in a web browser
3. All features work without any server

**Supported Browsers for File Access:**
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ⚠️ Chrome/Edge (may have CORS restrictions for local files)
- ✅ Opera

### Chrome/Edge Local File Fix
If Chrome shows CORS errors, launch with:
```bash
# Windows
chrome.exe --allow-file-access-from-files

# macOS
open -a "Google Chrome" --args --allow-file-access-from-files

# Linux
google-chrome --allow-file-access-from-files
```

## 🏢 Corporate Network Deployment

### Option 1: Shared Network Drive
```
\\company-server\tools\regex-tester\
├── index.html
├── app.js
├── themes\
└── ... (all files)
```

Users access via: `file://company-server/tools/regex-tester/index.html`

### Option 2: Internal Web Server (IIS)
1. Copy all files to `C:\inetpub\wwwroot\regex-tester\`
2. Create IIS Application pointing to this folder
3. No server-side configuration needed (pure static files)

### Option 3: Internal Web Server (Apache)
```apache
# /etc/apache2/sites-available/regex-tester.conf
<VirtualHost *:80>
    ServerName regex.internal.company.com
    DocumentRoot /var/www/regex-tester
    
    <Directory /var/www/regex-tester>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>
```

### Option 4: Internal Web Server (nginx)
```nginx
# /etc/nginx/sites-available/regex-tester
server {
    listen 80;
    server_name regex.internal.company.com;
    root /var/www/regex-tester;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 🐳 Docker Deployment

### Create Dockerfile
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

### Build and Run
```bash
# Build image
docker build -t regex-tester .

# Run container
docker run -d -p 8080:80 --name regex-tester regex-tester

# Access at http://localhost:8080
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3'
services:
  regex-tester:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./:/usr/share/nginx/html:ro
```

## 💾 Offline GitLab Setup

### Self-Hosted GitLab
1. Push to your internal GitLab instance
2. Enable GitLab Pages in admin settings
3. The included `.gitlab-ci.yml` will handle deployment

### GitLab Runner Configuration
```yaml
# For offline runner, ensure Docker image is cached
[[runners]]
  name = "offline-runner"
  url = "https://gitlab.internal.com"
  token = "YOUR-TOKEN"
  executor = "docker"
  [runners.docker]
    image = "alpine:latest"
    pull_policy = "if-not-present"
```

## 📦 Distribution Methods

### 1. ZIP Archive
```bash
# Create distributable archive
zip -r regex-tester-v2.0.0.zip regex-tester-v2.0.0/

# Users extract and open index.html
```

### 2. Self-Extracting Archive (Windows)
Use 7-Zip or WinRAR to create .exe that extracts and opens index.html

### 3. Electron App (Desktop Application)
```json
// package.json for Electron
{
  "name": "regex-tester-desktop",
  "version": "2.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  }
}
```

```javascript
// main.js
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
```

## 🔒 Security Considerations

### Content Security Policy
Add to `index.html` for extra security:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               script-src 'self' 'unsafe-inline';">
```

### MIME Types
Ensure your server sends correct MIME types:
- `.html` → `text/html`
- `.js` → `application/javascript`
- `.css` → `text/css`
- `.json` → `application/json`
- `.svg` → `image/svg+xml`

## ✅ Verification Checklist

After deployment, verify:
- [ ] Application loads without errors
- [ ] All 14 themes load correctly
- [ ] Pattern syntax highlighting works
- [ ] All regex modes function properly
- [ ] Pattern library displays
- [ ] Tooltips appear on hover
- [ ] Replacement preview works
- [ ] Favicon displays correctly

## 🚨 Common Issues

### Issue: Blank Page
**Solution**: Check browser console, ensure all files copied

### Issue: No Syntax Highlighting
**Solution**: Verify all .js files are present and loaded

### Issue: Themes Not Working
**Solution**: Check themes/ folder contains all CSS files

### Issue: CORS Errors
**Solution**: Use a local server or Firefox for file:// access

---

**Remember**: This application is 100% client-side. No server-side setup, database, or API configuration required!