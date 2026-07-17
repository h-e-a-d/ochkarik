// Canonical list of the services the practice offers.
//
// This is the SINGLE SOURCE OF TRUTH for the services section: index.njk renders
// both the visible cards AND the LocalBusiness `hasOfferCatalog` schema from this
// array. They cannot drift apart.
//
// That drift is exactly what this file exists to prevent. Before 2026-07-17 there
// were three disagreeing lists: 9 visible cards, 6 footer links, and 6 schema
// entries — the schema advertised "Dry Eye Management", "Ongoing Care" and
// "Pediatric Eye Care" that had no card anywhere on the page, which is structured
// data not representing visible content (a Google rich-results violation).
//
// To add a service: add an entry here AND `services.<key>.{title,description}` to
// all three locale files. Nothing else needs touching.
// Children's / pediatric eye care is intentionally absent — it is not offered.
//
// The footer's "Services" column also renders from this array (entries with
// `footer: true`), reading `services.<key>.title` from the locale JSON —
// eliminating a fifth, separate set of `footer.eyeExams`/`footer.glasses`/…
// strings that had already drifted in wording from these canonical titles.
//
//   key   → looks up `t.services[key]` in the locale JSON
//   id    → stable anchor for footer deep-links (#service-dry-eye)
//   icon  → Font Awesome 6 class
//
// `row` is derived (3 per row on lg) and drives the "Read More" toggle, which
// expands a whole row at once so card heights stay aligned.

const SERVICES = [
  { key: 'comprehensive',        id: 'service-comprehensive',        icon: 'fa-eye',            footer: true },
  { key: 'visometry',            id: 'service-visometry',            icon: 'fa-chart-line' },
  { key: 'autorefractometry',    id: 'service-autorefractometry',    icon: 'fa-microscope' },
  { key: 'subjective',           id: 'service-subjective',           icon: 'fa-glasses' },
  { key: 'accommodation',        id: 'service-accommodation',        icon: 'fa-expand' },
  { key: 'keratometry',          id: 'service-keratometry',          icon: 'fa-circle-notch' },
  { key: 'ophthalmoscopy',       id: 'service-ophthalmoscopy',       icon: 'fa-eye-dropper' },
  { key: 'prescriptionGlasses',  id: 'service-prescription-glasses', icon: 'fa-store',          footer: true },
  { key: 'contactsAndTreatment', id: 'service-contacts',             icon: 'fa-circle-dot',     footer: true },
  { key: 'dryEye',               id: 'service-dry-eye',              icon: 'fa-droplet',        footer: true },
  { key: 'ongoingCare',          id: 'service-followup',             icon: 'fa-calendar-check', footer: true },
];

const CARDS_PER_ROW = 3;

module.exports = SERVICES.map((s, i) => ({
  ...s,
  row: Math.floor(i / CARDS_PER_ROW),
  // The comprehensive card has a richer body (intro + diagnostics/treatment lists)
  // instead of a flat `description`, so the template renders it as a special case.
  rich: s.key === 'comprehensive',
}));
