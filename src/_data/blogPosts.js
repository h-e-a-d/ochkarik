// Blog post data loader.
// Reads all JSON files from src/_data/blog/posts/ and returns them sorted by date (newest first).
// Each JSON file represents one article in all supported languages.

const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "blog", "posts");

module.exports = function () {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"));
  const posts = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const post = JSON.parse(raw);
      // Validate minimum required fields
      if (post.id && post.slug && post.date && post.en) {
        posts.push(post);
      }
    } catch (err) {
      console.warn(`[blog] Skipping invalid post file: ${file}`, err.message);
    }
  }

  // Sort newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
};
