// Builds assets/icons.svg from Font Awesome Free 6.4.0 sources.
// Font Awesome Free icons: CC BY 4.0 — attribution kept in the sprite header.
//
// To add an icon: append [spriteId, "dir/name"] to ICONS (dir = solid|regular|brands,
// name = the FA 6 icon file name), run `node scripts/build-icon-sprite.mjs`,
// then use it as: <svg class="svg-icon"><use href="/assets/icons.svg#spriteId"></use></svg>
import { writeFileSync } from "node:fs";

const ICONS = [
  ["fa-star", "solid/star"], ["fa-chevron-down", "solid/chevron-down"],
  ["fa-chevron-right", "solid/chevron-right"], ["fa-quote-left", "solid/quote-left"],
  ["fa-eye", "solid/eye"], ["fa-bars", "solid/bars"], ["fa-xmark", "solid/xmark"],
  ["fa-globe", "solid/globe"], ["fa-newspaper", "solid/newspaper"], ["fa-link", "solid/link"],
  ["fa-glasses", "solid/glasses"], ["fa-eye-dropper", "solid/eye-dropper"],
  ["fa-user-md", "solid/user-doctor"], ["fa-store", "solid/store"], ["fa-phone", "solid/phone"],
  ["fa-microscope", "solid/microscope"], ["fa-language", "solid/language"],
  ["fa-expand", "solid/expand"], ["fa-comments", "solid/comments"], ["fa-clock", "solid/clock"],
  ["fa-circle-notch", "solid/circle-notch"], ["fa-circle-dot", "solid/circle-dot"],
  ["fa-check", "solid/check"], ["fa-chart-line", "solid/chart-line"],
  ["fa-arrow-right", "solid/arrow-right"], ["fa-arrow-left", "solid/arrow-left"],
  ["fa-regular-clock", "regular/clock"], ["fa-regular-calendar", "regular/calendar"],
  ["fa-droplet", "solid/droplet"], ["fa-calendar-check", "solid/calendar-check"],
  ["fa-instagram", "brands/instagram"], ["fa-facebook", "brands/facebook"],
  ["fa-facebook-f", "brands/facebook-f"], ["fa-whatsapp", "brands/whatsapp"],
  ["fa-twitter", "brands/twitter"], ["fa-telegram", "brands/telegram"],
  ["fa-linkedin", "brands/linkedin"],
];

const BASE = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.4.0/svgs/";
let symbols = "";
for (const [id, file] of ICONS) {
  const res = await fetch(BASE + file + ".svg");
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  const svg = await res.text();
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
                   .replace(/<!--[\s\S]*?-->/g, "").trim();
  symbols += `<symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>\n`;
}
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n<!-- Icons from Font Awesome Free 6.4.0 — https://fontawesome.com — CC BY 4.0 -->\n${symbols}</svg>\n`;
writeFileSync("assets/icons.svg", sprite);
console.log(`wrote assets/icons.svg with ${ICONS.length} symbols`);
