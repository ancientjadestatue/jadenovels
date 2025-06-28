FROM jekyll/jekyll:latest

# Set the working directory
WORKDIR /srv/jekyll

# Install dependencies first (for better Docker layer caching)
COPY Gemfile* ./
RUN bundle install

# Copy the rest of the project
COPY . .

# Expose the default Jekyll port and livereload port
EXPOSE 4000 35729

# Command to serve the site with livereload
CMD ["jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]
