# Deployment Instructions

## GitLab Pages
1. Create new GitLab project
2. Upload all files from this folder
3. Push to main branch
4. GitLab Pages will automatically deploy

## Local Testing
```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js  
npx http-server

# Option 3: Direct
Open index.html in your browser
```

## Verification
- Check that match highlighting works
- Test pattern conversions
- Verify copy buttons function
- Ensure offline functionality
