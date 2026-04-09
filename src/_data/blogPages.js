// Generates one page entry per post × locale combination.
// Eleventy paginates over this array to produce individual blog post pages.

const locales = require("./locales");

module.exports = function () {
  // blogPosts is loaded by Eleventy's data cascade from blogPosts.js
  // We need to load it directly here since this runs at data-merge time.
  const loadPosts = require("./blogPosts");
  const posts = typeof loadPosts === "function" ? loadPosts() : loadPosts;

  const pages = [];
  for (const post of posts) {
    for (const langCode of Object.keys(locales)) {
      // Only generate a page if the post has content for this language
      if (post[langCode]) {
        pages.push({
          post,
          lang: langCode,
          locale: locales[langCode],
        });
      }
    }
  }
  return pages;
};
