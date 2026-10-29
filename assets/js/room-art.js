/**
 * Wall artwork for the demonstration property (fictional, drawn in code).
 *
 * Every wall shares one architecture so seams line up: a 1000 × 1500 viewBox
 * (y from -250), eye level at y = 500, ceiling cove at y = 170, skirting and
 * floor from y = 748. `p` prefixes gradient ids so walls can coexist in the DOM.
 */

export const C = {
  ceiling: "#120f1c",
  floor: "#14111c",
  skirting: "#2b2439",
  frame: "#0d0b14",
  fabric: "#3a2e4c",
  plum: "#3b2f50",
  violet: "#5b4a6e",
  wood: "#6b4a35",
  woodLight: "#7a5640",
  woodDark: "#4a3326",
  brass: "#c9a46a",
  linen: "#e8e2d6",
  linenLight: "#f6f2ea",
  yellow: "#E8C547",
  lilac: "#C8A8E9",
  teal: "#5DD6B3",
  coral: "#E87D7D",
  blue: "#7DB8E8",
  leaf: "#2d6a55",
  leaf2: "#3f8a6d",
  glass: "#0b0912",
};

const glow = (id, color, a = 0.38) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${a}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
const dusk = (id) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241f45"/><stop offset=".5" stop-color="#7b67b0"/><stop offset=".8" stop-color="#e3a0a0"/><stop offset="1" stop-color="#f1c36b"/></linearGradient>`;
const warm = (id) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.yellow}" stop-opacity=".5"/><stop offset="1" stop-color="#f2a65a" stop-opacity=".85"/></linearGradient>`;

export function shell(p, wall, inner, defs = "", cove = C.yellow) {
  const planks = [800, 870, 960, 1090, 1240]
    .map((y) => `<rect x="0" y="${y}" width="1000" height="2" fill="#fff" opacity=".035"/>`)
    .join("");
  return `<svg viewBox="0 -250 1000 1500" preserveAspectRatio="none" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="${p}cove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cove}" stop-opacity=".16"/><stop offset="1" stop-color="${cove}" stop-opacity="0"/></linearGradient>
${defs}
</defs>
<rect x="0" y="-250" width="1000" height="1500" fill="${wall}"/>
<rect x="0" y="-250" width="1000" height="420" fill="${C.ceiling}"/>
<rect x="0" y="170" width="1000" height="140" fill="url(#${p}cove)"/>
<rect x="0" y="163" width="1000" height="7" fill="${cove}" opacity=".55"/>
<rect x="0" y="760" width="1000" height="490" fill="${C.floor}"/>
${planks}
${inner}
<rect x="0" y="748" width="1000" height="14" fill="${C.skirting}"/>
</svg>`;
}

const pendant = (x, drop = 400, w = 70) =>
  `<path d="M${x} 170V${drop - 30}" stroke="${C.brass}" stroke-width="3"/>
<path d="M${x - w / 2} ${drop}Q${x} ${drop - 62} ${x + w / 2} ${drop}Z" fill="#f2d68f"/>
<ellipse cx="${x}" cy="${drop + 4}" rx="${w / 2}" ry="7" fill="${C.yellow}" opacity=".9"/>`;

const chairBack = (x, y = 640, w = 64, fill = C.plum) =>
  `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${748 - y - 24}" rx="12" fill="${fill}"/>
<rect x="${x - w / 2 + 6}" y="${748 - 26}" width="7" height="26" fill="${fill}"/><rect x="${x + w / 2 - 13}" y="${748 - 26}" width="7" height="26" fill="${fill}"/>`;

const plant = (x, scale = 1) =>
  `<g transform="translate(${x} 0) scale(${scale} 1)"><rect x="-28" y="676" width="56" height="72" fill="${C.brass}"/>
<ellipse cx="-12" cy="600" rx="20" ry="58" fill="${C.leaf}" transform="rotate(-18 -12 600)"/>
<ellipse cx="18" cy="590" rx="18" ry="62" fill="${C.leaf2}" transform="rotate(16 18 590)"/>
<ellipse cx="2" cy="560" rx="16" ry="70" fill="${C.leaf}"/></g>`;

const label = (x, y, text, size = 22, fill = C.linen, op = 0.85) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Space Mono, monospace" font-size="${size}" letter-spacing="6" fill="${fill}" opacity="${op}">${text}</text>`;

export const ART = {
  /* ── Suite ─────────────────────────────────────────────────────────── */
  "suite.view": (p) =>
    shell(
      p,
      "#231d33",
      `<rect x="120" y="180" width="95" height="568" fill="${C.fabric}"/>
<rect x="785" y="180" width="95" height="568" fill="${C.fabric}"/>
<path d="M145 180V748M170 180V748M195 180V748M810 180V748M835 180V748M860 180V748" stroke="#2a2140" stroke-width="3"/>
<rect x="225" y="235" width="550" height="455" fill="url(#${p}sky)"/>
<circle cx="612" cy="588" r="36" fill="#ffe7a8"/>
<circle cx="612" cy="588" r="120" fill="url(#${p}sun)"/>
<path d="M225 598Q300 538 380 584T540 566T700 556T775 572V690H225Z" fill="#5a4f80"/>
<path d="M225 628Q320 584 420 624T620 612T775 606V690H225Z" fill="#34465a"/>
<path d="M225 660Q330 628 450 664T680 652T775 660V690H225Z" fill="#1f3838"/>
<rect x="225" y="235" width="550" height="455" fill="none" stroke="${C.frame}" stroke-width="14"/>
<rect x="496" y="235" width="8" height="455" fill="${C.frame}"/>
<rect x="225" y="455" width="550" height="6" fill="${C.frame}"/>
<rect x="210" y="688" width="580" height="14" fill="${C.fabric}"/>
<ellipse cx="500" cy="980" rx="390" ry="96" fill="#2a2238"/>
<ellipse cx="500" cy="980" rx="330" ry="72" fill="none" stroke="${C.lilac}" stroke-opacity=".18" stroke-width="3"/>
<rect x="270" y="700" width="460" height="50" rx="6" fill="#4b3d5f"/>
<rect x="285" y="668" width="430" height="42" rx="12" fill="#6a5884"/>
<rect x="302" y="636" width="92" height="42" rx="12" fill="${C.lilac}" opacity=".9"/>
<rect x="606" y="636" width="92" height="42" rx="12" fill="${C.yellow}" opacity=".85"/>`,
      `${dusk(p + "sky")}${glow(p + "sun", "#ffe7a8", 0.45)}`,
    ),

  "suite.bed": (p) =>
    shell(
      p,
      "#1f1a2e",
      `<circle cx="165" cy="590" r="170" fill="url(#${p}glow)"/>
<circle cx="835" cy="590" r="170" fill="url(#${p}glow)"/>
<rect x="390" y="250" width="220" height="150" fill="${C.frame}"/>
<rect x="402" y="262" width="196" height="126" fill="#2a2448"/>
<circle cx="548" cy="300" r="14" fill="${C.yellow}"/>
<path d="M402 360Q450 318 500 352T598 336" fill="none" stroke="${C.lilac}" stroke-width="4"/>
<path d="M402 378Q460 350 520 372T598 362" fill="none" stroke="${C.teal}" stroke-width="3" opacity=".8"/>
<rect x="260" y="440" width="480" height="232" rx="8" fill="${C.plum}"/>
<path d="M320 448V664M380 448V664M440 448V664M500 448V664M560 448V664M620 448V664M680 448V664" stroke="#000" stroke-opacity=".18" stroke-width="3"/>
<rect x="290" y="590" width="190" height="62" rx="18" fill="${C.linenLight}"/>
<rect x="520" y="590" width="190" height="62" rx="18" fill="${C.linenLight}"/>
<rect x="230" y="640" width="540" height="122" rx="10" fill="${C.linen}"/>
<rect x="230" y="640" width="540" height="18" rx="8" fill="${C.linenLight}"/>
<rect x="230" y="702" width="540" height="36" fill="${C.yellow}" opacity=".9"/>
<rect x="110" y="650" width="110" height="98" fill="${C.wood}"/>
<rect x="780" y="650" width="110" height="98" fill="${C.wood}"/>
<rect x="155" y="608" width="20" height="42" fill="${C.brass}"/>
<rect x="825" y="608" width="20" height="42" fill="${C.brass}"/>
<path d="M125 556H205L190 610H140Z" fill="#f2d68f"/>
<path d="M795 556H875L860 610H810Z" fill="#f2d68f"/>`,
      glow(p + "glow", C.yellow, 0.34),
    ),

  "suite.door": (p) =>
    shell(
      p,
      "#1b1729",
      `<rect x="100" y="230" width="240" height="518" fill="#2c2440"/>
<path d="M220 230V748" stroke="${C.frame}" stroke-width="4"/>
<rect x="206" y="470" width="5" height="64" fill="${C.brass}"/>
<rect x="229" y="470" width="5" height="64" fill="${C.brass}"/>
<rect x="420" y="300" width="200" height="448" fill="${C.glass}"/>
<rect x="432" y="312" width="62" height="436" fill="url(#${p}corridor)"/>
<polygon points="494,312 604,292 604,770 494,748" fill="#5a4535"/>
<circle cx="588" cy="540" r="7" fill="${C.brass}"/>
<rect x="420" y="300" width="200" height="448" fill="none" stroke="${C.fabric}" stroke-width="12"/>
<polygon points="432,762 494,762 600,1240 300,1240" fill="${C.yellow}" opacity=".1"/>
<rect x="650" y="498" width="18" height="28" rx="2" fill="${C.fabric}"/>
<rect x="705" y="600" width="150" height="92" rx="12" fill="${C.teal}" opacity=".85"/>
<rect x="760" y="586" width="40" height="16" rx="6" fill="none" stroke="${C.teal}" stroke-width="5" opacity=".85"/>
<rect x="680" y="690" width="200" height="18" fill="${C.wood}"/>
<rect x="690" y="708" width="10" height="40" fill="${C.wood}"/>
<rect x="860" y="708" width="10" height="40" fill="${C.wood}"/>`,
      warm(p + "corridor"),
    ),

  "suite.desk": (p) =>
    shell(
      p,
      "#211c31",
      `<circle cx="470" cy="520" r="160" fill="url(#${p}glow)"/>
<circle cx="330" cy="400" r="105" fill="url(#${p}mirror)" stroke="${C.brass}" stroke-width="8"/>
<rect x="600" y="360" width="280" height="10" fill="${C.wood}"/>
<rect x="615" y="298" width="22" height="62" fill="${C.blue}"/>
<rect x="640" y="308" width="18" height="52" fill="${C.coral}"/>
<rect x="661" y="292" width="24" height="68" fill="${C.lilac}"/>
<rect x="688" y="312" width="16" height="48" fill="${C.linen}"/>
<rect x="800" y="330" width="40" height="30" rx="4" fill="${C.brass}"/>
<ellipse cx="808" cy="318" rx="22" ry="14" fill="${C.leaf}"/>
<ellipse cx="832" cy="312" rx="18" ry="12" fill="${C.leaf2}"/>
<rect x="160" y="590" width="360" height="16" fill="${C.woodLight}"/>
<rect x="175" y="606" width="10" height="142" fill="${C.woodLight}"/>
<rect x="495" y="606" width="10" height="142" fill="${C.woodLight}"/>
<polygon points="285,590 395,590 380,548 300,548" fill="#8d93ab"/>
<rect x="282" y="586" width="116" height="6" fill="#b9bed0"/>
<path d="M460 590L478 512L436 478" fill="none" stroke="${C.brass}" stroke-width="6"/>
<path d="M412 470L452 452L462 494Z" fill="#f2d68f"/>
${chairBack(335, 612, 130)}
<rect x="610" y="640" width="250" height="108" rx="26" fill="${C.violet}"/>
<rect x="600" y="612" width="50" height="136" rx="20" fill="#4b3d5f"/>
<rect x="820" y="612" width="50" height="136" rx="20" fill="#4b3d5f"/>
<rect x="652" y="626" width="166" height="40" rx="14" fill="#6a5884"/>
${plant(928)}`,
      `${glow(p + "glow", C.yellow, 0.3)}<linearGradient id="${p}mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.lilac}" stop-opacity=".35"/><stop offset=".55" stop-color="#2a2448"/><stop offset="1" stop-color="${C.lilac}" stop-opacity=".18"/></linearGradient>`,
    ),

  /* ── Lobby ─────────────────────────────────────────────────────────── */
  "lobby.entrance": (p) =>
    shell(
      p,
      "#2a2236",
      `<rect x="300" y="250" width="400" height="498" fill="url(#${p}sky)"/>
<path d="M300 610Q380 560 470 596T640 584T700 590V748H300Z" fill="#34465a"/>
<path d="M300 650Q400 620 500 646T700 640V748H300Z" fill="#1f3838"/>
<circle cx="380" cy="640" r="40" fill="${C.leaf}"/><rect x="376" y="660" width="8" height="88" fill="#1a2a28"/>
<circle cx="630" cy="628" r="48" fill="${C.leaf2}" opacity=".9"/><rect x="626" y="650" width="8" height="98" fill="#1a2a28"/>
<rect x="300" y="250" width="400" height="498" fill="none" stroke="${C.frame}" stroke-width="16"/>
<rect x="496" y="250" width="8" height="498" fill="${C.frame}"/>
<rect x="300" y="300" width="400" height="6" fill="${C.frame}"/>
<rect x="470" y="470" width="8" height="90" rx="3" fill="${C.brass}"/><rect x="522" y="470" width="8" height="90" rx="3" fill="${C.brass}"/>
<rect x="280" y="232" width="440" height="22" fill="${C.woodDark}"/>
${label(500, 226, "WELCOME", 18, C.brass, 0.9)}
<circle cx="200" cy="420" r="120" fill="url(#${p}glow)"/><circle cx="800" cy="420" r="120" fill="url(#${p}glow)"/>
<rect x="190" y="400" width="20" height="44" rx="4" fill="#f2d68f"/><rect x="790" y="400" width="20" height="44" rx="4" fill="#f2d68f"/>
${plant(170, 1.3)}${plant(830, 1.3)}
<ellipse cx="500" cy="900" rx="230" ry="60" fill="${C.woodDark}" opacity=".8"/>
<polygon points="300,762 700,762 820,1240 180,1240" fill="#f1c36b" opacity=".07"/>`,
      `${dusk(p + "sky")}${glow(p + "glow", C.yellow, 0.3)}`,
    ),

  "lobby.restaurant": (p) =>
    shell(
      p,
      "#261f31",
      `<path d="M320 748V420A180 180 0 0 1 680 420V748Z" fill="${C.glass}"/>
<path d="M320 748V420A180 180 0 0 1 680 420V748Z" fill="url(#${p}inside)"/>
${pendant(430, 470, 54)}${pendant(570, 470, 54)}
<ellipse cx="430" cy="676" rx="62" ry="10" fill="${C.woodLight}"/><rect x="426" y="676" width="8" height="72" fill="${C.woodLight}"/>
<ellipse cx="575" cy="676" rx="62" ry="10" fill="${C.woodLight}"/><rect x="571" y="676" width="8" height="72" fill="${C.woodLight}"/>
<path d="M320 748V420A180 180 0 0 1 680 420V748" fill="none" stroke="${C.brass}" stroke-width="10"/>
${label(500, 214, "RESTAURANT", 22, C.brass, 0.95)}
<rect x="410" y="226" width="180" height="2" fill="${C.brass}" opacity=".6"/>
<rect x="90" y="300" width="150" height="190" fill="${C.frame}"/><rect x="102" y="312" width="126" height="166" fill="#3a2f55"/>
<circle cx="165" cy="370" r="34" fill="${C.coral}" opacity=".8"/><rect x="102" y="420" width="126" height="58" fill="${C.teal}" opacity=".5"/>
<rect x="760" y="650" width="180" height="98" rx="18" fill="${C.violet}"/><rect x="772" y="620" width="156" height="44" rx="14" fill="#6a5884"/>
<polygon points="330,762 670,762 760,1240 240,1240" fill="${C.yellow}" opacity=".06"/>`,
      `<radialGradient id="${p}inside" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="${C.yellow}" stop-opacity=".45"/><stop offset="1" stop-color="${C.yellow}" stop-opacity=".02"/></radialGradient>`,
    ),

  "lobby.reception": (p) =>
    shell(
      p,
      "#211b2d",
      `<rect x="280" y="236" width="440" height="290" fill="${C.woodDark}"/>
<rect x="300" y="256" width="400" height="250" fill="#2e2440"/>
<rect x="300" y="370" width="400" height="6" fill="${C.yellow}" opacity=".8"/>
<rect x="300" y="376" width="400" height="60" fill="url(#${p}strip)"/>
${label(500, 330, "RECEPTION", 26, C.linen, 0.92)}
${pendant(370, 430, 60)}${pendant(630, 430, 60)}
<rect x="230" y="560" width="540" height="22" fill="${C.linen}"/>
<rect x="245" y="582" width="510" height="166" fill="${C.wood}"/>
<path d="M290 590V740M335 590V740M380 590V740M425 590V740M470 590V740M515 590V740M560 590V740M605 590V740M650 590V740M695 590V740" stroke="${C.woodDark}" stroke-width="5"/>
<rect x="640" y="532" width="34" height="28" rx="4" fill="${C.brass}"/>
<circle cx="350" cy="548" r="12" fill="${C.brass}"/><rect x="342" y="550" width="16" height="10" fill="${C.brass}"/>
<rect x="90" y="300" width="130" height="200" fill="${C.frame}"/>
<path d="M110 330H200M110 370H200M110 410H200M110 450H200" stroke="${C.brass}" stroke-width="3" stroke-dasharray="14 12"/>
${plant(880, 1.2)}`,
      `<linearGradient id="${p}strip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.yellow}" stop-opacity=".3"/><stop offset="1" stop-color="${C.yellow}" stop-opacity="0"/></linearGradient>`,
    ),

  "lobby.rooms": (p) =>
    shell(
      p,
      "#241e30",
      `<rect x="380" y="290" width="240" height="458" fill="#17131f"/>
<polygon points="380,290 620,290 560,400 440,400" fill="#120f1a"/>
<polygon points="380,748 620,748 560,620 440,620" fill="#1d1828"/>
<polygon points="380,290 440,400 440,620 380,748" fill="#1f1a2b"/>
<polygon points="620,290 560,400 560,620 620,748" fill="#1b1726"/>
<rect x="470" y="430" width="60" height="190" fill="url(#${p}end)"/>
<circle cx="500" cy="400" r="6" fill="${C.yellow}"/>
<rect x="380" y="290" width="240" height="458" fill="none" stroke="${C.fabric}" stroke-width="12"/>
${label(500, 262, "ROOMS  →", 22, C.brass, 0.95)}
<rect x="110" y="300" width="200" height="140" fill="${C.frame}"/><rect x="122" y="312" width="176" height="116" fill="#2a2448"/>
<path d="M122 400Q170 360 214 392T298 380" fill="none" stroke="${C.lilac}" stroke-width="4"/>
<rect x="110" y="660" width="210" height="18" fill="${C.wood}"/><rect x="120" y="678" width="10" height="70" fill="${C.wood}"/><rect x="300" y="678" width="10" height="70" fill="${C.wood}"/>
<rect x="160" y="620" width="70" height="40" rx="6" fill="${C.teal}" opacity=".7"/>
<rect x="680" y="640" width="230" height="108" rx="26" fill="${C.plum}"/><rect x="668" y="612" width="50" height="136" rx="20" fill="#4b3d5f"/><rect x="872" y="612" width="50" height="136" rx="20" fill="#4b3d5f"/>
<polygon points="440,762 560,762 620,1100 380,1100" fill="${C.yellow}" opacity=".06"/>`,
      warm(p + "end"),
    ),

  /* ── Restaurant ────────────────────────────────────────────────────── */
  "restaurant.windows": (p) =>
    shell(
      p,
      "#251f31",
      [130, 395, 660]
        .map(
          (x) => `<rect x="${x}" y="220" width="210" height="470" fill="url(#${p}sky)"/>
<path d="M${x} 600Q${x + 60} 560 ${x + 120} 590T${x + 210} 584V690H${x}Z" fill="#34465a"/>
<path d="M${x} 640Q${x + 90} 616 ${x + 210} 636V690H${x}Z" fill="#1f3838"/>
<rect x="${x}" y="220" width="210" height="470" fill="none" stroke="${C.frame}" stroke-width="12"/>
<rect x="${x + 101}" y="220" width="8" height="470" fill="${C.frame}"/>`,
        )
        .join("") +
        `<path d="M130 300Q500 380 870 300" fill="none" stroke="#f2d68f" stroke-width="2" stroke-dasharray="2 22" stroke-linecap="round" opacity=".9"/>
<ellipse cx="260" cy="650" rx="92" ry="14" fill="${C.woodLight}"/><rect x="256" y="650" width="8" height="98" fill="${C.woodLight}"/>
<ellipse cx="740" cy="650" rx="92" ry="14" fill="${C.woodLight}"/><rect x="736" y="650" width="8" height="98" fill="${C.woodLight}"/>
<rect x="232" y="628" width="10" height="22" fill="#f2d68f"/><rect x="712" y="628" width="10" height="22" fill="#f2d68f"/>
${chairBack(170, 640, 60)}${chairBack(350, 640, 60)}${chairBack(650, 640, 60)}${chairBack(830, 640, 60)}`,
      dusk(p + "sky"),
    ),

  "restaurant.bar": (p) =>
    shell(
      p,
      "#1e1929",
      `<rect x="140" y="240" width="720" height="300" fill="${C.woodDark}"/>
<rect x="160" y="258" width="680" height="264" fill="url(#${p}mirror)"/>
${[330, 430]
  .map((y) => `<rect x="160" y="${y}" width="680" height="8" fill="${C.wood}"/>`)
  .join("")}
${Array.from({ length: 22 }, (_, i) => {
  const x = 180 + i * 30;
  const h = 40 + ((i * 37) % 30);
  const col = [C.coral, C.teal, C.yellow, C.lilac, C.blue, C.linen][i % 6];
  return `<rect x="${x}" y="${330 - h}" width="14" height="${h}" rx="4" fill="${col}" opacity=".75"/><rect x="${x + 4}" y="${330 - h - 14}" width="6" height="14" fill="${col}" opacity=".75"/>`;
}).join("")}
${Array.from({ length: 16 }, (_, i) => `<rect x="${190 + i * 40}" y="${400}" width="22" height="30" rx="3" fill="${C.linen}" opacity=".35"/>`).join("")}
${pendant(300, 460, 64)}${pendant(500, 460, 64)}${pendant(700, 460, 64)}
<rect x="110" y="560" width="780" height="24" fill="${C.linen}"/>
<rect x="130" y="584" width="740" height="164" fill="${C.plum}"/>
<path d="M130 640H870M130 696H870" stroke="${C.brass}" stroke-width="3" opacity=".6"/>
${[260, 420, 580, 740]
  .map(
    (x) => `<ellipse cx="${x}" cy="660" rx="38" ry="10" fill="${C.brass}"/><rect x="${x - 4}" y="660" width="8" height="88" fill="${C.brass}"/><rect x="${x - 24}" y="716" width="48" height="5" fill="${C.brass}"/>`,
  )
  .join("")}`,
      `<linearGradient id="${p}mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.lilac}" stop-opacity=".22"/><stop offset=".6" stop-color="#2a2448"/><stop offset="1" stop-color="${C.yellow}" stop-opacity=".18"/></linearGradient>`,
    ),

  "restaurant.lobby": (p) =>
    shell(
      p,
      "#221c2e",
      `<path d="M380 748V430A120 120 0 0 1 620 430V748Z" fill="${C.glass}"/>
<path d="M380 748V430A120 120 0 0 1 620 430V748Z" fill="url(#${p}inside)"/>
<rect x="450" y="560" width="100" height="188" fill="#2e2440"/><rect x="450" y="545" width="100" height="18" fill="${C.linen}" opacity=".7"/>
<path d="M380 748V430A120 120 0 0 1 620 430V748" fill="none" stroke="${C.brass}" stroke-width="10"/>
${label(500, 280, "←  LOBBY", 20, C.brass, 0.95)}
<rect x="140" y="290" width="190" height="270" fill="${C.frame}"/><rect x="152" y="302" width="166" height="246" fill="#1a1626"/>
${label(235, 345, "MENU", 20, C.yellow, 0.9)}
<path d="M172 380H298M172 412H280M172 444H298M172 476H262M172 508H290" stroke="${C.linen}" stroke-width="4" opacity=".45"/>
<rect x="700" y="570" width="110" height="178" fill="${C.wood}"/><rect x="690" y="556" width="130" height="18" fill="${C.woodLight}"/>
<rect x="740" y="516" width="14" height="40" fill="${C.brass}"/><path d="M724 500H770L760 520H734Z" fill="#f2d68f"/>
${plant(880, 1.2)}
<polygon points="390,762 610,762 700,1200 300,1200" fill="${C.yellow}" opacity=".06"/>`,
      `<radialGradient id="${p}inside" cx=".5" cy=".6" r=".65"><stop offset="0" stop-color="${C.yellow}" stop-opacity=".38"/><stop offset="1" stop-color="${C.yellow}" stop-opacity=".02"/></radialGradient>`,
    ),

  "restaurant.dining": (p) =>
    shell(
      p,
      "#211b2e",
      `<rect x="320" y="236" width="360" height="220" fill="${C.frame}"/><rect x="334" y="250" width="332" height="192" fill="#2a2448"/>
<circle cx="600" cy="300" r="22" fill="${C.yellow}"/>
<path d="M334 400Q410 340 500 384T666 362V442H334Z" fill="#5a4f80"/>
<path d="M334 420Q440 392 540 418T666 410V442H334Z" fill="${C.teal}" opacity=".6"/>
${pendant(320, 470, 56)}${pendant(500, 470, 56)}${pendant(680, 470, 56)}
<rect x="170" y="606" width="660" height="16" fill="${C.woodLight}"/>
<rect x="190" y="622" width="10" height="126" fill="${C.woodLight}"/><rect x="800" y="622" width="10" height="126" fill="${C.woodLight}"/>
${[250, 345, 440, 560, 655, 750].map((x) => `<rect x="${x - 10}" y="586" width="20" height="20" rx="4" fill="${C.linen}" opacity=".8"/>`).join("")}
${[250, 345, 440, 560, 655, 750].map((x) => chairBack(x, 650, 66, C.violet)).join("")}
<circle cx="120" cy="420" r="110" fill="url(#${p}glow)"/><circle cx="880" cy="420" r="110" fill="url(#${p}glow)"/>
<rect x="110" y="400" width="20" height="40" rx="4" fill="#f2d68f"/><rect x="870" y="400" width="20" height="40" rx="4" fill="#f2d68f"/>`,
      glow(p + "glow", C.yellow, 0.3),
    ),
};
