#!/bin/bash
# Script to create GitHub release for Regex Tester v2.0.0

# Configuration
REPO_OWNER="your-github-username"  # Replace with your GitHub username
REPO_NAME="regex-tester"           # Replace with your repository name
TAG="v2.0.0"
RELEASE_NAME="Regex Tester v2.0.0 - Offline GitLab Package"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://cli.github.com/manual/installation"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "Not authenticated with GitHub. Please run:"
    echo "gh auth login"
    exit 1
fi

echo "Creating GitHub release for $TAG..."

# Create the release with the content from GITHUB_RELEASE.md
gh release create "$TAG" \
    --repo "$REPO_OWNER/$REPO_NAME" \
    --title "$RELEASE_NAME" \
    --notes-file "release/GITHUB_RELEASE.md" \
    --draft \
    regex-tester-v2.0.0-offline.tar.gz \
    regex-tester-v2.0.0-offline.zip \
    SHA256SUMS.txt

if [ $? -eq 0 ]; then
    echo "✅ Draft release created successfully!"
    echo "📝 Please review and publish at: https://github.com/$REPO_OWNER/$REPO_NAME/releases"
else
    echo "❌ Failed to create release"
fi