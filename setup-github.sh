#!/bin/bash

echo "🚀 Preparing Jade's Romance Library for GitHub..."

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Jade's Romance Library with Jekyll setup"

echo "✨ Repository ready!"
echo ""
echo "🔗 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/yourusername/your-repo-name.git"
echo "3. Run: git push -u origin main"
echo "4. Enable GitHub Pages in your repository settings (Source: GitHub Actions)"
echo ""
echo "📖 Your site will be available at: https://yourusername.github.io/your-repo-name/"
