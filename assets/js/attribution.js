/**
 * Attribution capture: UTM parameters, fbclid and landing URL.
 *
 * First touch is kept for the whole browser session so values survive
 * in-page navigation. Only parameters actually present in the URL are
 * recorded; nothing is inferred or defaulted.
 */

const KEY = "todo_vt_attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "fbclid"];

let storageOK = true;

function store() {
  try {
    const s = window.sessionStorage;
    const probe = "__vt_probe";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    storageOK = false;
    return null; // Some in-app WebViews block storage.
  }
}

/** False when first-touch data can't persist between pages. */
export function attributionStorageOK() {
  return storageOK;
}

/** Captured campaign parameters as a query string (for link carry-over). */
export function attributionQuery() {
  if (!firstTouch) return "";
  const qs = new URLSearchParams();
  for (const p of PARAMS) if (firstTouch[p]) qs.set(p, firstTouch[p]);
  return qs.toString();
}

function readCookie(name) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

let firstTouch = null;

export function captureAttribution() {
  const url = new URL(location.href);
  const current = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) current[p] = v.slice(0, 300);
  }

  const s = store();
  try {
    const saved = s && s.getItem(KEY);
    if (saved) firstTouch = JSON.parse(saved);
  } catch {
    firstTouch = null;
  }

  if (!firstTouch) {
    firstTouch = {
      ...current,
      landing_page_url: location.href,
      referrer: document.referrer || null,
      captured_at: new Date().toISOString(),
    };
    try {
      s && s.setItem(KEY, JSON.stringify(firstTouch));
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }
  return firstTouch;
}

/** Meta click identifiers for future Conversions API matching. */
function metaIds() {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  if (!fbc && firstTouch && firstTouch.fbclid) {
    const ts = Date.parse(firstTouch.captured_at) || Date.now();
    fbc = `fb.1.${ts}.${firstTouch.fbclid}`;
  }
  return { fbp: fbp || null, fbc: fbc || null };
}

export function attributionPayload() {
  const ft = firstTouch || captureAttribution();
  const utm = {};
  for (const p of PARAMS) if (p !== "fbclid" && ft[p]) utm[p] = ft[p];
  return {
    utm,
    fbclid: ft.fbclid || null,
    landing_page_url: ft.landing_page_url,
    referrer: ft.referrer,
    first_seen_at: ft.captured_at,
    page_url: location.href,
    ...metaIds(),
  };
}
