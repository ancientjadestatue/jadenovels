# Jade's Romance Library

A Jekyll-based website for publishing romance novels, hosted on GitHub Pages.

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
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 2. Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Scroll down to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### 3. Access Your Site

Your site will be available at: `https://yourusername.github.io/your-repo-name/`

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

To run locally:

1. Install Jekyll: `gem install jekyll bundler`
2. Run: `bundle exec jekyll serve`
3. Open `http://localhost:4000` in your browser

## Features

- Responsive design that works on mobile and desktop
- Clean, readable typography optimized for long-form content
- Automatic navigation between chapters
- Jekyll/GitHub Pages compatible
- SEO-friendly with proper meta tags
