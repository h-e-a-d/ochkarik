const fs   = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Inline a file's contents directly into a template (used to inline tailwind.css).
  // Usage: {% inlineFile "tailwind.css" %}
  eleventyConfig.addShortcode("inlineFile", function (filePath) {
    return fs.readFileSync(path.resolve(filePath), "utf8");
  });
  // Pass-through: existing static assets ship as-is.
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "script.js": "script.js" });
  eleventyConfig.addPassthroughCopy({ "vision-test.js": "vision-test.js" });
  eleventyConfig.addPassthroughCopy({ "vision-disorders.js": "vision-disorders.js" });
  eleventyConfig.addPassthroughCopy({ "glasses-anim.js": "glasses-anim.js" });
  eleventyConfig.addPassthroughCopy({ "sw.js": "sw.js" });
  eleventyConfig.addPassthroughCopy({ "tailwind.css": "tailwind.css" });
  eleventyConfig.addPassthroughCopy({ "favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "_headers": "_headers" });

  // Blog static assets
  eleventyConfig.addPassthroughCopy({ "blog/blog.css": "blog/blog.css" });
  eleventyConfig.addPassthroughCopy({ "blog/blog.js": "blog/blog.js" });

  // Watch locale JSON for hot reload.
  eleventyConfig.addWatchTarget("./src/_data/locales/");
  eleventyConfig.addWatchTarget("./src/_data/blog/posts/");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
