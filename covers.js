"use strict";
/* ============================================================
   Иконки (в стиле Lucide) и оригинальные SVG-обложки
   ============================================================
   Чтобы подключить НАСТОЯЩИЕ обложки: положите картинки в папку
   covers/ рядом с index.html и впишите их сюда по id книги, например:
     COVER_IMAGES = { 1: "covers/master.jpg", 2: "covers/1984.jpg" };
   Если картинка не найдена, автоматически покажется нарисованная обложка.
   ============================================================ */
const COVER_IMAGES = {};

const ICON_PATHS = {
  "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  home: '<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "chevron-up": '<path d="m18 15-6-6-6 6"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/>',
  files: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M15 2v5h5"/><path d="M8 13h8M8 17h8"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  "hard-drive": '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
};
function ic(name, size, cls) {
  const s = size || 18;
  const fill = name === "star" ? "currentColor" : "none";
  return `<svg class="ic ${cls || ""}" viewBox="0 0 24 24" width="${s}" height="${s}" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
}

/* ---------- Обложки ---------- */
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function lum(hex) {
  if (!/^#[0-9a-f]{3,6}$/i.test(hex)) return 1;
  let h = hex.slice(1); if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const n = parseInt(h, 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}
function wrapTitle(t, max) {
  const lines = []; let cur = "";
  t.split(/\s+/).forEach(w => {
    if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
  });
  if (cur) lines.push(cur);
  return lines.slice(0, 5);
}

const R = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");
const MOTIFS = {
  1: p => `<path d="M122 52a58 58 0 1 0 0 112a46 46 0 1 1 0-112z" fill="${p.fg}" opacity=".95"/>
    <g fill="#000" opacity=".6"><rect x="22" y="190" width="156" height="40"/><rect x="34" y="172" width="14" height="20"/><ellipse cx="41" cy="168" rx="9" ry="12"/>
    <rect x="84" y="162" width="18" height="30"/><ellipse cx="93" cy="156" rx="11" ry="15"/><rect x="138" y="174" width="14" height="18"/><ellipse cx="145" cy="170" rx="8" ry="11"/></g>
    <g fill="${p.fg}"><circle cx="40" cy="70" r="2"/><circle cx="165" cy="128" r="2"/><circle cx="68" cy="112" r="1.5"/></g>`,
  2: p => `<path d="M18 120Q100 40 182 120Q100 200 18 120Z" fill="#0a0a0d" stroke="${p.fg}" stroke-width="4"/>
    <circle cx="100" cy="120" r="34" fill="${p.c2}"/><circle cx="100" cy="120" r="14" fill="#000"/><circle cx="107" cy="113" r="5" fill="#fff"/>
    <g stroke="${p.c2}" stroke-width="3" stroke-linecap="round"><line x1="100" y1="62" x2="100" y2="44"/><line x1="58" y1="74" x2="48" y2="58"/><line x1="142" y1="74" x2="152" y2="58"/></g>
    <rect x="30" y="198" width="140" height="5" fill="${p.c2}"/>`,
  3: p => `<g fill="${p.fg}"><circle cx="40" cy="60" r="2"/><circle cx="90" cy="45" r="1.5"/><circle cx="165" cy="120" r="2"/><circle cx="60" cy="100" r="1.5"/><circle cx="120" cy="80" r="1.5"/></g>
    <polygon transform="translate(132 34) scale(.8)" points="20,0 0,50 14,50 6,86 34,36 20,36 30,0" fill="${p.fg}"/>
    <g fill="#08112b" opacity=".92"><rect x="28" y="190" width="144" height="38"/><rect x="40" y="152" width="24" height="42"/><polygon points="38,152 52,122 66,152"/>
    <rect x="86" y="136" width="28" height="58"/><polygon points="84,136 100,98 116,136"/><rect x="136" y="160" width="22" height="34"/><polygon points="134,160 147,134 160,160"/></g>
    <g fill="#ffd866"><rect x="96" y="150" width="8" height="12" rx="4"/><rect x="48" y="166" width="6" height="9" rx="3"/><rect x="143" y="172" width="6" height="9" rx="3"/><rect x="60" y="204" width="6" height="9"/><rect x="120" y="204" width="6" height="9"/></g>`,
  4: p => `<circle cx="70" cy="78" r="24" fill="${p.fg}"/><circle cx="128" cy="62" r="13" fill="${p.fg}" opacity=".85"/>
    <path d="M0 170Q50 120 110 158T200 132V300H0Z" fill="#c97b24" opacity=".95"/><path d="M0 210Q70 165 130 198T200 176V300H0Z" fill="#8a4b12"/>
    <path d="M0 250Q80 215 200 238V300H0Z" fill="#5a300c"/>`,
  5: p => `<g fill="#a2472a" opacity=".92"><rect x="68" y="130" width="64" height="60" rx="24"/><rect x="64" y="74" width="15" height="68" rx="7.500" transform="rotate(-14 71 140)"/>
    <rect x="82" y="56" width="15" height="84" rx="7.500"/><rect x="101" y="52" width="15" height="88" rx="7.500"/><rect x="120" y="66" width="15" height="76" rx="7.500" transform="rotate(12 127 140)"/>
    <rect x="128" y="146" width="15" height="52" rx="7.500" transform="rotate(-55 132 150)"/></g>
    <g fill="${p.fg}" opacity=".35">${R(18, i => `<circle cx="${22 + (i * 37) % 160}" cy="${210 + (i * 53) % 40}" r="${2 + i % 3}"/>`)}</g>`,
  6: p => `<text x="100" y="152" text-anchor="middle" font-family="Consolas,monospace" font-size="96" font-weight="700" fill="${p.fg}">{ }</text>
    <g fill="${p.fg}" opacity=".55"><rect x="48" y="172" width="70" height="7" rx="3.500"/><rect x="60" y="188" width="92" height="7" rx="3.500"/><rect x="48" y="204" width="50" height="7" rx="3.500"/></g>
    <circle cx="156" cy="62" r="10" fill="#34d399"/><path d="M151 62l4 4 7-8" stroke="#06281f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  7: p => `${R(4, i => `<circle cx="100" cy="128" r="${22 + i * 20}" fill="none" stroke="${p.fg}" stroke-width="3" opacity="${0.9 - i * 0.2}"/>`)}
    <circle cx="100" cy="128" r="9" fill="${p.fg}"/><path d="M100 128l46-30" stroke="${p.fg}" stroke-width="3"/><circle cx="146" cy="98" r="6" fill="#ffd866"/>`,
  8: p => `<circle cx="150" cy="62" r="20" fill="${p.fg}" opacity=".9"/><g fill="${p.fg}" opacity=".5"><polygon points="0,170 50,110 100,170"/><polygon points="70,170 130,100 200,170"/></g>
    <g fill="#05070f" opacity=".85"><rect x="26" y="176" width="150" height="26" rx="3"/><rect x="26" y="158" width="38" height="24"/><rect x="34" y="144" width="10" height="16"/><circle cx="46" cy="206" r="8"/><circle cx="90" cy="206" r="8"/><circle cx="140" cy="206" r="8"/></g>
    <g fill="#ffd866">${R(5, i => `<rect x="${72 + i * 20}" y="182" width="11" height="9" rx="1.500"/>`)}</g>
    <g fill="${p.fg}" opacity=".7">${R(22, i => `<circle cx="${(i * 41) % 200}" cy="${30 + (i * 29) % 120}" r="1.300"/>`)}</g>`,
  9: p => `<g fill="#0a0d14" opacity=".9"><rect x="20" y="70" width="70" height="170"/><rect x="100" y="96" width="82" height="144"/></g>
    <g fill="#2a3144">${R(3, r => R(2, c => `<rect x="${32 + c * 30}" y="${86 + r * 44}" width="16" height="26"/>`)).replace(/./, c => c)}${R(2, r => R(2, c => `<rect x="${112 + c * 36}" y="${112 + r * 44}" width="18" height="26"/>`))}</g>
    <rect x="62" y="130" width="16" height="26" fill="#ffd866"/>
    <g stroke="${p.fg}" stroke-width="1.200" opacity=".35">${R(16, i => `<line x1="${i * 13}" y1="30" x2="${i * 13 - 24}" y2="${230}"/>`)}</g>`,
  10: p => `<path d="M100 220V130" stroke="#5f8f5a" stroke-width="5" stroke-linecap="round"/><path d="M100 190Q70 180 66 160Q92 160 100 190" fill="#5f8f5a"/>
    <g fill="${p.fg}">${R(6, i => `<ellipse cx="100" cy="92" rx="14" ry="34" transform="rotate(${i * 60} 100 120)"/>`)}</g><circle cx="100" cy="120" r="12" fill="#ffd866"/>`,
  11: p => `${R(3, i => `<path d="M${28 + i * 48} 220V130a22 22 0 0 1 44 0V220" fill="none" stroke="${p.fg}" stroke-width="4"/>`)}
    <g fill="${p.fg}" opacity=".85">${R(3, i => `<circle cx="${50 + i * 48}" cy="${130 + (i === 1 ? -4 : 4)}" r="9"/>`)}</g><path d="M100 54v44M86 68h28" stroke="${p.fg}" stroke-width="5" stroke-linecap="round"/>`,
  12: p => `<g fill="#1a0f08"><ellipse cx="102" cy="150" rx="46" ry="26"/><circle cx="62" cy="120" r="22"/><polygon points="48,106 40,80 62,98"/><polygon points="66,100 78,76 84,104"/>
    <rect x="62" y="162" width="11" height="46" rx="4"/><rect x="82" y="168" width="11" height="40" rx="4"/><rect x="122" y="168" width="11" height="40" rx="4"/><rect x="138" y="160" width="11" height="48" rx="4"/>
    <path d="M144 140Q172 112 170 94" stroke="#1a0f08" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="46" cy="126" rx="9" ry="7"/></g>
    <circle cx="62" cy="116" r="3" fill="${p.fg}"/><path d="M96 124l12 14-12 14" stroke="${p.fg}" stroke-width="0" fill="none"/><circle cx="100" cy="148" r="8" fill="#b3231f"/>`,
  13: p => `<g stroke="${p.fg}" stroke-width="4" stroke-linecap="round">${R(3, i => `<line x1="100" y1="66" x2="100" y2="174" transform="rotate(${i * 60} 100 120)"/>`)}
    ${R(6, i => `<g transform="rotate(${i * 60} 100 120)"><line x1="100" y1="84" x2="88" y2="74"/><line x1="100" y1="84" x2="112" y2="74"/></g>`)}</g>
    <circle cx="100" cy="120" r="8" fill="${p.fg}"/><g fill="${p.fg}" opacity=".6">${R(14, i => `<circle cx="${(i * 47) % 190 + 6}" cy="${40 + (i * 61) % 170}" r="2"/>`)}</g>`,
  14: p => `<circle cx="100" cy="116" r="50" fill="#000"/><path d="M100 66a50 50 0 0 0 0 100z" fill="${p.fg}"/>
    <g fill="#05070f" opacity=".95">${R(9, i => `<rect x="${i * 22 - 4}" y="${176 - (i * 37) % 40}" width="20" height="${60 + (i * 37) % 40}"/>`)}</g>
    <g fill="#ffd866">${R(8, i => `<rect x="${i * 24 + 2}" y="${196 + (i * 13) % 20}" width="5" height="6"/>`)}</g>`,
  15: p => `<circle cx="100" cy="96" r="38" fill="${p.c2}" opacity=".9"/><rect x="0" y="120" width="200" height="180" fill="#04141a"/>
    <g stroke="${p.fg}" stroke-width="1.500" opacity=".85">${R(9, i => `<line x1="100" y1="120" x2="${-80 + i * 45}" y2="240"/>`)}${R(5, i => `<line x1="0" y1="${130 + i * i * 6 + i * 6}" x2="200" y2="${130 + i * i * 6 + i * 6}"/>`)}</g>`,
  16: p => `<g fill="${p.fg}" opacity=".7">${R(12, i => `<circle cx="${(i * 53) % 200}" cy="${(i * 29) % 90 + 14}" r="1.500"/>`)}</g>
    <g fill="#0b1520"><rect x="44" y="110" width="112" height="100"/><polygon points="40,110 100,70 160,110"/><rect x="28" y="170" width="30" height="40"/><rect x="142" y="170" width="30" height="40"/></g>
    <g fill="#ffcf5a">${R(3, r => R(4, c => `<rect x="${54 + c * 26}" y="${122 + r * 28}" width="14" height="16" ${(r + c) % 3 === 0 ? 'opacity=".3"' : ""}/>`))}</g>
    <path d="M0 222Q100 204 200 222V300H0Z" fill="${p.fg}" opacity=".9"/>`,
  17: p => `${R(5, i => `<rect x="${24 + i * 14}" y="${58 + i * 20}" width="${152 - i * 28}" height="${170 - i * 40}" fill="${i % 2 ? "#0e2a14" : "#1a4d26"}" stroke="${p.fg}" stroke-width="1.500"/>`)}
    <rect x="84" y="138" width="32" height="50" fill="#06140a" stroke="${p.fg}" stroke-width="1.500"/><circle cx="110" cy="164" r="2" fill="${p.fg}"/>`,
  18: p => `<ellipse cx="100" cy="124" rx="52" ry="64" fill="${p.fg}"/><path d="M62 108q16-14 30 0q-14 12-30 0z M108 108q14-14 30 0q-16 12-30 0z" fill="#2a0f22"/>
    <path d="M80 160q20 16 40 0" stroke="#2a0f22" stroke-width="4" fill="none" stroke-linecap="round"/><polygon points="100,70 112,86 100,102 88,86" fill="${p.c2}"/>
    <path d="M60 172Q100 200 140 172" stroke="${p.c2}" stroke-width="6" fill="none"/>`,
  19: p => `<path d="M138 56a40 40 0 1 0 0 80a32 32 0 1 1 0-80z" fill="${p.fg}"/><polygon points="150,86 154,96 165,96 156,102 160,112 150,106 140,112 144,102 135,96 146,96" fill="${p.fg}"/>
    <g fill="#1a0b08"><circle cx="82" cy="110" r="18"/><path d="M68 132h28l10 52H58z"/><rect x="50" y="184" width="64" height="10" rx="3"/><rect x="44" y="194" width="76" height="12" rx="4"/></g>`,
  20: p => `<g fill="none" stroke="${p.fg}">${R(5, i => `<ellipse cx="100" cy="124" rx="${34 + i * 16}" ry="${12 + i * 6}" transform="rotate(-24 100 124)" stroke-width="${3 - i * 0.4}" opacity="${1 - i * 0.17}"/>`)}</g>
    <circle cx="100" cy="124" r="16" fill="#000" stroke="#fff" stroke-width="3"/><g fill="${p.fg}">${R(24, i => `<circle cx="${(i * 67) % 200}" cy="${(i * 41) % 215 + 10}" r="1.200"/>`)}</g>`,
  21: p => `${R(3, s => R(3 + s * 2, i => `<g><ellipse cx="${46 + s * 54}" cy="${206 - i * 14}" rx="22" ry="7" fill="#b8860b"/><rect x="${24 + s * 54}" y="${199 - i * 14}" width="44" height="7" fill="#e9b727"/><ellipse cx="${46 + s * 54}" cy="${199 - i * 14}" rx="22" ry="7" fill="#ffd24d"/></g>`)).replace(/(<g>)/g, "$1")}`,
  22: p => `${R(5, i => `<rect x="${22 + i * 32}" y="${190 - i * 28}" width="28" height="${50 + i * 28}" fill="${p.fg}" opacity="${0.45 + i * 0.12}"/>`)}
    <path d="M30 120L100 86l24 14 40-40" stroke="${p.fg}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><polygon points="170,50 154,56 168,68" fill="${p.fg}"/>`,
  23: p => `<g transform="rotate(35 100 130)"><path d="M100 50Q130 90 124 160H76Q70 90 100 50Z" fill="${p.fg}"/><circle cx="100" cy="106" r="14" fill="#1a0f0f" stroke="${p.c2}" stroke-width="4"/>
    <polygon points="76,130 52,166 76,160" fill="${p.c2}"/><polygon points="124,130 148,166 124,160" fill="${p.c2}"/><path d="M88 160Q100 214 112 160Z" fill="#ffb020"/></g>
    <g fill="${p.fg}" opacity=".6">${R(10, i => `<circle cx="${(i * 71) % 200}" cy="${(i * 43) % 120 + 20}" r="1.400"/>`)}</g>`,
  24: p => `<g stroke="${p.fg}" stroke-width="3" opacity=".8"><line x1="100" y1="70" x2="64" y2="124"/><line x1="100" y1="70" x2="136" y2="124"/><line x1="64" y1="124" x2="46" y2="180"/><line x1="64" y1="124" x2="82" y2="180"/><line x1="136" y1="124" x2="118" y2="180"/><line x1="136" y1="124" x2="154" y2="180"/></g>
    ${[[100, 70], [64, 124], [136, 124], [46, 180], [82, 180], [118, 180], [154, 180]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="13" fill="${i === 4 ? "#34d399" : p.fg}"/>`).join("")}`,
  25: p => `<circle cx="74" cy="124" r="46" fill="none" stroke="${p.fg}" stroke-width="4"/><circle cx="126" cy="124" r="46" fill="none" stroke="${p.fg}" stroke-width="4" opacity=".65"/>
    <polygon points="80,92 62,128 76,128 68,160 92,118 78,118 90,92" fill="#ffd866"/><path d="M126 124V98M126 124l18 10" stroke="${p.fg}" stroke-width="4" stroke-linecap="round"/><circle cx="126" cy="124" r="4" fill="${p.fg}"/>`,
  26: p => `<g fill="none" stroke="#6a5a2a" stroke-width="3.500">${R(3, i => `<ellipse cx="100" cy="124" rx="62" ry="22" transform="rotate(${i * 60} 100 124)"/>`)}</g>
    <circle cx="100" cy="124" r="14" fill="#c0392b"/><g fill="#2c3e50"><circle cx="162" cy="124" r="7"/><circle cx="69" cy="70" r="7"/><circle cx="69" cy="178" r="7"/></g>`
};

function genericMotif(p, seed) {
  const k = seed % 4;
  if (k === 0) return R(5, i => `<circle cx="100" cy="120" r="${22 + i * 16}" fill="none" stroke="${p.fg}" stroke-width="3" opacity="${0.9 - i * 0.15}"/>`);
  if (k === 1) return R(9, i => `<rect x="${-20 + i * 28}" y="40" width="10" height="190" fill="${p.fg}" opacity=".35" transform="skewX(-20)"/>`);
  if (k === 2) return `<polygon points="100,50 170,190 30,190" fill="none" stroke="${p.fg}" stroke-width="4"/><polygon points="100,90 144,176 56,176" fill="${p.fg}" opacity=".4"/>`;
  return R(25, i => `<circle cx="${34 + (i % 5) * 33}" cy="${60 + Math.floor(i / 5) * 33}" r="${i % 2 ? 6 : 10}" fill="${p.fg}" opacity=".5"/>`);
}

let _uid = 0;
function coverSVG(book) {
  const id = "cg" + (++_uid);
  const p = { c1: book.c1, c2: book.c2, fg: book.fg };
  const dark = lum(book.fg) < 0.5;                       // тёмный текст на светлой обложке
  const motif = MOTIFS[book.id] ? MOTIFS[book.id](p) : genericMotif(p, (book.id || 0) + book.title.length);
  const lines = wrapTitle(book.title, 11);
  const maxLen = Math.max(...lines.map(l => l.length), 1);
  const size = Math.max(13, Math.min(26, 168 / (maxLen * 0.6)));
  const lh = size * 1.15;
  const y0 = 288 - (lines.length - 1) * lh;
  const tspans = lines.map((l, i) => `<tspan x="100" y="${(y0 + i * lh).toFixed(1)}">${esc(l)}</tspan>`).join("");
  return `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(book.title)}" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="${id}" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="${book.c1}"/><stop offset="1" stop-color="${book.c2}"/></linearGradient>
<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark ? "#fff" : "#000"}" stop-opacity="0"/><stop offset="1" stop-color="${dark ? "#fff" : "#000"}" stop-opacity=".62"/></linearGradient></defs>
<rect width="200" height="300" fill="url(#${id})"/>
${motif}
<rect y="170" width="200" height="130" fill="url(#${id}s)"/>
<text x="100" y="26" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="1.2" fill="${book.fg}" opacity=".92">${esc(book.author.toUpperCase())}</text>
<text text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="${size.toFixed(1)}" fill="${book.fg}">${tspans}</text>
<rect width="9" height="300" fill="#000" opacity=".18"/><rect x="9" width="2" height="300" fill="#fff" opacity=".12"/>
</svg>`;
}

if (typeof module !== "undefined") module.exports = { coverSVG, ic, MOTIFS };
