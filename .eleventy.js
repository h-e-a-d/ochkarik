module.exports = function (eleventyConfig) {
  // Pass-through: existing static assets ship as-is.
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "script.js": "script.js" });
  eleventyConfig.addPassthroughCopy({ "vision-test.js": "vision-test.js" });
  eleventyConfig.addPassthroughCopy({ "vision-disorders.js": "vision-disorders.js" });
  eleventyConfig.addPassthroughCopy({ "sw.js": "sw.js" });
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
