# Jade's Romance Library

A Jekyll-based website for publishing romance novels, hosted on GitHub Pages.

## Quick Setup for GitHub Pages

### Step 1: Repository Setup
1. Create a new repository on GitHub (e.g., `jadenovels`)
2. Upload all files to your repository
3. In `_config.yml`, update these lines:
   ```yaml
   baseurl: "/your-repository-name"  # Replace with your actual repo name
   url: "https://yourusername.github.io"  # Replace with your GitHub username
   ```

### Step 2: Enable GitHub Pages
1. Go to your repository Settings
2. Scroll to "Pages" section  
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### Step 3: Access Your Site
Your site will be live at: `https://yourusername.github.io/your-repository-name/`

**Note:** First deployment takes 5-10 minutes. Check the "Actions" tab for build progress.

## Structure

- **index.md** - Main library page showing all books
- **books/** - Individual book landing pages  
- **chapters/** - Individual chapter files
- **_layouts/** - HTML templates
- **_templates/** - Templates for creating new content

## Adding a New Book

1. **Create the book page**: Copy `_templates/book-template.md` to `books/[book-name].md`
2. **Fill in the book details**: Update title, description, status, etc.
3. **Update the main index**: Add the new book to the collection in `index.md`
4. **Create chapter files**: Use the same format as existing chapters
5. **Update navigation**: Ensure chapters link back to their book

## Book Page Template Variables

- `title`: Book title
- `description`: Brief description for the library page
- `status`: "In Progress", "Complete", or "Coming Soon"
- `author`: Author name
- `genre`: Book genre
- `tags`: Array of tags for the book
- `cover_color`: Hex color for the book header background
- `permalink`: URL path for the book

## Chapter Template Variables

- `title`: Chapter title
- `chapter`: Chapter number
- `book`: Book title (for navigation)
- `book_url`: URL back to the book page

## GitHub Pages Setup

This repository is configured to work with GitHub Pages using Jekyll. Here's how to set it up:

### 1. Push to GitHub

1. Create a new repository on GitHub
2. Push all files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 2. Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Scroll down to "Pages" section
3. Under "Source", select "GitHub Actions"
4. The site will automatically deploy when you push to the main branch

### 3. Access Your Site

Your site will be available at: `https://yourusername.github.io/your-repo-name/`

**Note:** The first deployment may take a few minutes. Check the "Actions" tab in your repository to see the deployment progress.

## File Structure

- `index.md` - Homepage with chapter links
- `chapter1.md` - Chapter 1 content
- `_config.yml` - Jekyll configuration
- `_layouts/default.html` - Template for all pages
- `README.md` - This file

## Adding New Chapters

To add a new chapter:

1. Create a new file named `chapter2.md`, `chapter3.md`, etc.
2. Add the frontmatter at the top:
   ```yaml
   ---
   layout: default
   title: "Chapter 2: Title Here"
   chapter: 2
   ---
   ```
3. Add your chapter content below the frontmatter
4. Update the `index.md` file to include a link to the new chapter

## Local Development

### Option 1: Using Jekyll directly (Recommended for GitHub Pages compatibility)

1. Install Ruby (version 3.1 or higher)
2. Install Bundler: `gem install bundler`
3. Install dependencies: `bundle install`
4. Run the development server: `bundle exec jekyll serve`
5. Open `http://localhost:4000` in your browser

### Option 2: Using Docker (for development only - not needed for GitHub Pages)

If you prefer Docker for local development:

1. Install Docker Desktop
2. Run: `docker-compose up --build`
3. Open `http://localhost:4000` in your browser

**Note:** Docker files are excluded from the repository via `.gitignore` as GitHub Pages doesn't use them.

## Features

- Responsive design that works on mobile and desktop
- Clean, readable typography optimized for long-form content
- Automatic navigation between chapters
- Jekyll/GitHub Pages compatible
- SEO-friendly with proper meta tags
