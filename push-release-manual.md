# Manual GitHub Release Instructions

Since I cannot directly access GitHub, here are the steps to create the release:

## Option 1: Using GitHub CLI (Recommended)

```bash
# 1. Install GitHub CLI if not already installed
# macOS: brew install gh
# Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md
# Windows: Download from https://cli.github.com/

# 2. Authenticate with GitHub
gh auth login

# 3. Create the release
gh release create v2.0.0 \
  --title "Regex Tester v2.0.0 - Offline GitLab Package" \
  --notes-file RELEASE_NOTES_v2.0.0.md \
  regex-tester-v2.0.0-offline.tar.gz \
  regex-tester-v2.0.0-offline.zip \
  SHA256SUMS.txt

# 4. Or create as draft to review first
gh release create v2.0.0 \
  --title "Regex Tester v2.0.0 - Offline GitLab Package" \
  --notes-file RELEASE_NOTES_v2.0.0.md \
  --draft \
  regex-tester-v2.0.0-offline.tar.gz \
  regex-tester-v2.0.0-offline.zip \
  SHA256SUMS.txt
```

## Option 2: Using Git Commands + Web Interface

```bash
# 1. Create and push the tag
git tag -a v2.0.0 -m "Release version 2.0.0 - Offline GitLab Package"
git push origin v2.0.0

# 2. Go to GitHub releases page
# https://github.com/YOUR_USERNAME/YOUR_REPO/releases/new

# 3. Select the v2.0.0 tag

# 4. Fill in:
# - Release title: Regex Tester v2.0.0 - Offline GitLab Package
# - Copy the content from RELEASE_NOTES_v2.0.0.md

# 5. Attach files:
# - regex-tester-v2.0.0-offline.tar.gz
# - regex-tester-v2.0.0-offline.zip
# - SHA256SUMS.txt

# 6. Click "Publish release"
```

## Option 3: Using the Web Interface Only

1. Go to your repository on GitHub
2. Click on "Releases" (right side of the page)
3. Click "Draft a new release"
4. Click "Choose a tag" → Type `v2.0.0` → Click "Create new tag: v2.0.0 on publish"
5. Release title: `Regex Tester v2.0.0 - Offline GitLab Package`
6. Copy and paste the content from `RELEASE_NOTES_v2.0.0.md` into the description
7. Drag and drop these files into the attachment area:
   - `regex-tester-v2.0.0-offline.tar.gz`
   - `regex-tester-v2.0.0-offline.zip`
   - `SHA256SUMS.txt`
8. Check "Set as the latest release"
9. Click "Publish release"

## Files to Upload

Make sure you have these files ready:
- ✅ regex-tester-v2.0.0-offline.tar.gz (157 KB)
- ✅ regex-tester-v2.0.0-offline.zip (200 KB)
- ✅ SHA256SUMS.txt

## Release Notes Content

The release notes are in `RELEASE_NOTES_v2.0.0.md`. Key highlights:
- Complete offline package for GitLab deployment
- Enhanced features (syntax highlighting, tooltips, pattern library)
- 100% self-contained with no external dependencies
- Includes GitLab CI/CD configuration
- Comprehensive documentation

## After Publishing

The release will be available at:
`https://github.com/YOUR_USERNAME/YOUR_REPO/releases/tag/v2.0.0`

Users can download the archives directly and deploy to their offline GitLab instances!