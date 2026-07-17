// Site-wide derived values, available to every template as `site.*`.
//
// Values that appear in copy are exposed to the locale strings as placeholders
// ({year}, {years}) and substituted centrally in locales.js — see there.
// The point is that nobody has to remember to update a number each January.

// The practice opened in 2017 ("Excellence in ophthalmology since 2017").
const PRACTICE_START_YEAR = 2017;

const buildYear = new Date().getFullYear();

module.exports = {
  // Footer copyright. Was hardcoded "© 2025" in all three locales and had
  // already gone stale before anyone noticed.
  buildYear,

  practiceStartYear: PRACTICE_START_YEAR,

  // Years of experience, everywhere it is claimed: meta description, schema
  // description, about copy, the credential list and the stats circle. It was
  // hardcoded as "8" across 12 locale strings, the stats markup and the
  // counter target in script.js — and was a full year out of date.
  //
  // Russian grammar note: 5–20 all take the genitive plural "лет", so this
  // phrasing stays correct until 2038 ("21 год"). Tajik does not inflect.
  yearsExperience: buildYear - PRACTICE_START_YEAR,
};
