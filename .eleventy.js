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

  // Watch locale JSON for hot reload.
  eleventyConfig.addWatchTarget("./src/_data/locales/");

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
