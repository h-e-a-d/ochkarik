// Site-wide values available to every template as `site.*`.
module.exports = {
  // Rendered into the footer copyright via the {year} placeholder in the locale
  // strings, so the year can never go stale the way a hardcoded "© 2025" did.
  // Refreshes on every build (the blog workflow rebuilds on each new post).
  buildYear: new Date().getFullYear(),
};
