/**
 * Tracking adapter for Meta Pixel (browser) with Conversions API in mind.
 *
 * - No script loads unless a Pixel ID is configured AND consent is granted.
 * - Every event is still recorded in window.__vtEvents so behaviour can be
 *   verified locally without sending anything to Meta.
 * - Lead carries an eventID that the backend must reuse for its CAPI event
 *   (same event_name + event_id = deduplicated by Meta).
 */
import { CONFIG } from "./config.js";

const log = (window.__vtEvents = window.__vtEvents || []);
let pixelReady = false;
const once = new Set();

function loadPixel(id) {
  /* Standard Meta base code, deferred until consent. */
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq("init", id);
  pixelReady = true;
}

export function newEventId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "vt-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

/**
 * @param {"PageView"|"ViewContent"|"Lead"|"Contact"} name
 * @param {object} params
 * @param {{eventID?: string, onceKey?: string}} opts
 */
export function track(name, params = {}, opts = {}) {
  if (opts.onceKey) {
    if (once.has(opts.onceKey)) return;
    once.add(opts.onceKey);
  }
  const eventID = opts.eventID || newEventId();
  const entry = { name, params, eventID, at: new Date().toISOString(), sent: false };

  if (pixelReady && window.fbq) {
    window.fbq("track", name, params, { eventID });
    entry.sent = true;
  }
  log.push(entry);
  if (CONFIG.tracking.debug) {
    console.info(`[tracking] ${name}${entry.sent ? "" : " (not sent: Pixel inactive)"}`, params, eventID);
  }
  return eventID;
}

export function initTracking() {
  const { metaPixelId, consentGranted } = CONFIG.tracking;
  let allowed = false;
  try {
    allowed = Boolean(consentGranted());
  } catch {
    allowed = false;
  }
  if (metaPixelId && allowed) loadPixel(metaPixelId);

  track("PageView", {}, { onceKey: "pageview" });

  // Contact: any configured contact CTA. Never blocks navigation.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-contact]");
    if (!a) return;
    track(
      "Contact",
      { content_name: CONFIG.page.service, channel: a.dataset.contact, placement: a.dataset.placement || "unknown" },
      { onceKey: `contact:${a.dataset.contact}:${a.dataset.placement || ""}` },
    );
  });
}

/** Fired once per page view when a visitor actually opens a tour. */
export function trackViewContent(contentId) {
  track(
    "ViewContent",
    { content_name: CONFIG.page.service, content_category: "service_landing", content_ids: [contentId] },
    { onceKey: "viewcontent" },
  );
}
