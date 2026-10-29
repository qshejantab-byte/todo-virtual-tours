/**
 * Project sheet: a small drawing that drafts the visitor's enquiry as they
 * fill in the form (decorative; the form remains the accessible source).
 */

const VP = `<path class="cone" d="M50 64L36 40A28 28 0 0 1 64 40Z"/><circle class="dot" cx="50" cy="64" r="4"/>`;

const GLYPHS = {
  none: `<rect class="ln" x="12" y="12" width="76" height="76" stroke-dasharray="4 5"/>`,
  rooms: `<rect class="ln" x="10" y="10" width="80" height="80"/><path class="ln" d="M10 44H90M36 10V44M64 10V44M36 56V90M64 56V90M10 56H90"/><path class="ln" d="M16 16h14v10H16zM42 16h16v10H42zM70 16h14v10H70z"/>`,
  restaurant: `<rect class="ln" x="10" y="10" width="80" height="80"/><circle class="ln" cx="30" cy="30" r="7"/><circle class="ln" cx="70" cy="30" r="7"/><circle class="ln" cx="30" cy="70" r="7"/><circle class="ln" cx="70" cy="74" r="7"/><path class="ln" d="M16 16H84"/>`,
  venue: `<rect class="ln" x="10" y="10" width="80" height="80"/><rect class="ln" x="26" y="14" width="48" height="12"/><path class="ln" d="M20 76h60M20 84h60" stroke-dasharray="2 4"/>`,
  home: `<rect class="ln" x="10" y="10" width="80" height="80"/><path class="ln" d="M10 50H52M52 10V90M52 62H90M30 50a12 12 0 0 1 12-12"/>`,
  school: `<rect class="ln" x="10" y="12" width="34" height="30"/><rect class="ln" x="56" y="12" width="34" height="48"/><rect class="ln" x="10" y="56" width="34" height="32"/><path class="ln" d="M44 27H56M27 42V56" stroke-dasharray="3 3"/>`,
  tourism: `<path class="ln" d="M8 70Q30 50 50 62T92 54M8 84Q34 66 56 76T92 70M8 52Q30 30 52 44T92 34"/><path class="ln" d="M14 90Q40 70 50 64" stroke-dasharray="3 4"/>`,
  showroom: `<rect class="ln" x="10" y="10" width="80" height="80"/><rect class="ln" x="20" y="18" width="16" height="16"/><rect class="ln" x="64" y="18" width="16" height="16"/><rect class="ln" x="20" y="74" width="60" height="8"/>`,
};

const TYPE_GLYPH = {
  hotel: "rooms",
  guesthouse: "rooms",
  restaurant: "restaurant",
  venue: "venue",
  real_estate_residential: "home",
  real_estate_commercial: "showroom",
  school: "school",
  tourism: "tourism",
  showroom: "showroom",
  office: "showroom",
  other: "none",
};

export function mountSheet(sheet, form) {
  if (!sheet || !form) return;
  const art = sheet.querySelector("[data-sheet-art]");
  const fields = {
    business: sheet.querySelector('[data-sheet="business"]'),
    property_type: sheet.querySelector('[data-sheet="property_type"]'),
    location: sheet.querySelector('[data-sheet="location"]'),
    size: sheet.querySelector('[data-sheet="size"]'),
  };
  let glyph = null;

  const set = (name, text) => {
    const dd = fields[name];
    if (!dd) return;
    const value = text || "—";
    if (dd.textContent === value) return;
    dd.textContent = value;
    dd.classList.toggle("is-empty", !text);
    dd.classList.remove("is-fresh");
    if (text) {
      void dd.offsetWidth;
      dd.classList.add("is-fresh");
    }
  };

  const sync = () => {
    set("business", form.elements.business.value.trim());
    const sel = form.elements.property_type;
    set("property_type", sel.value ? sel.options[sel.selectedIndex].text : "");
    set("location", form.elements.location.value.trim());
    set("size", form.elements.size.value.trim());
    const g = TYPE_GLYPH[sel.value] || "none";
    if (g !== glyph) {
      glyph = g;
      art.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${GLYPHS[g]}${g === "none" ? "" : VP}</svg>`;
    }
  };

  // Progress: how many required details are filled in. Counted from the
  // form's own required fields, so it follows the email policy in config.
  const fill = document.querySelector("[data-progress-fill]");
  const text = document.querySelector("[data-progress-text]");
  const status = sheet.querySelector("[data-sheet-status]");
  const progress = () => {
    const req = [...form.querySelectorAll("[required]")];
    const done = req.filter((el) => el.value.trim().length > (el.name === "description" ? 14 : 0)).length;
    if (fill) fill.style.transform = `scaleX(${req.length ? done / req.length : 0})`;
    if (text) text.textContent = done === req.length ? "All required details added" : `${done} of ${req.length} required details`;
    if (status) status.textContent = done === req.length ? "Ready to send" : "Draft";
    sheet.classList.toggle("is-ready", done === req.length);
  };
  form.addEventListener("input", progress);
  form.addEventListener("change", progress);
  progress();
  form.addEventListener("input", sync);
  form.addEventListener("change", sync);
  sync();
}
