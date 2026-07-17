// Generates one page entry per post × locale combination.
// Eleventy paginates over this array to produce individual blog post pages.

const locales = require("./locales");

const RELATED_LIMIT = 3;

// Score how related `candidate` is to `post`: a shared category outweighs any
// single shared tag, and ties fall back to recency (posts arrive newest-first).
//
// Related links exist to give the blog internal structure. Without them every
// article is a leaf — reachable only from the listing page — which wastes the
// crawl equity of 8 posts × 3 locales and leaves readers nowhere to go next.
function relatednessScore(post, candidate) {
  let score = 0;
  if (candidate.category && candidate.category === post.category) score += 10;
  const tags = new Set(post.tags || []);
  for (const tag of candidate.tags || []) {
    if (tags.has(tag)) score += 1;
  }
  return score;
}

function pickRelated(post, posts, langCode) {
  return posts
    .filter((c) => c.slug !== post.slug && c[langCode]) // must exist in this language
    .map((c, i) => ({ post: c, score: relatednessScore(post, c), order: i }))
    // Unrelated posts stay in as filler so the block is never short on a small
    // blog, but genuinely related ones always rank first.
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, RELATED_LIMIT)
    .map((x) => x.post);
}

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
          related: pickRelated(post, posts, langCode),
        });
      }
    }
  }
  return pages;
};
