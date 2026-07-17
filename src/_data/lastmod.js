// Real last-modified dates for the non-blog pages, read from git history.
//
// The sitemap used to stamp `<lastmod>` with the *build* date, so every deploy
// claimed the homepage, blog index and privacy page had all just changed —
// even when only one blog post was added. Google only honours lastmod when it
// is "consistently and verifiably accurate"; feeding it a build timestamp
// teaches it to ignore lastmod for the whole sitemap, including the blog posts
// where the date genuinely is correct.
//
// Blog posts don't need this — they carry an explicit `date` in their JSON.
//
// Fallback: if git history isn't available (shallow clone, tarball deploy) or
// the file was never committed, we return null and sitemap.njk omits <lastmod>
// for that URL. Omitting is correct; guessing is what caused the problem.

const { execSync } = require("child_process");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..", "..");

function gitLastModified(...files) {
  let newest = null;
  for (const file of files) {
    try {
      const out = execSync(
        `git log -1 --format=%cs -- ${JSON.stringify(file)}`,
        { cwd: REPO_ROOT, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }
      ).trim();
      // %cs is already YYYY-MM-DD; empty means git knows nothing about this path.
      if (out && (!newest || out > newest)) newest = out;
    } catch {
      // git missing or not a repo — leave `newest` as-is.
    }
  }
  return newest;
}

// A page's date is the newest of its template and the content that feeds it.
const LOCALES = "src/_data/locales";

module.exports = {
  home: gitLastModified("src/index.njk", LOCALES, "src/_data/services.js"),
  blog: gitLastModified("src/blog/index.njk", LOCALES),
  privacy: gitLastModified("src/privacy.njk", LOCALES),
};
