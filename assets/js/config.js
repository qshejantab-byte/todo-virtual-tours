/**
 * Virtual Tours landing page — single source of configuration.
 *
 * Everything that depends on a business decision, credential or permission
 * lives here. Values that are not yet confirmed are left null/false on
 * purpose: the page degrades honestly instead of guessing.
 * See README.md → "Launch gates".
 */

/** Review mode shows pending (unapproved) content locally, clearly badged.
 *  ?review=1 forces it on, ?review=0 forces the production view. */
function detectReviewMode() {
  const flag = new URLSearchParams(location.search).get("review");
  if (flag === "1") return true;
  if (flag === "0") return false;
  return ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
}

export const REVIEW_MODE = detectReviewMode();

export const CONFIG = {
  page: {
    id: "virtual-tours",
    service: "Virtual Tours",
  },

  contact: {
    // Supplied by the business for this page. No lead inbox or notification
    // workflow has been tested against it.
    email: "info@todo.rw",
    mainSite: "https://todo.rw/",

    whatsapp: {
      // UNCONFIRMED. The live site uses 250799537999 and older local code
      // uses 250794003368. Set `number` (digits only, with country code) and
      // `confirmed: true` once sales confirms. Until then no WhatsApp CTA is
      // rendered in the production view.
      confirmed: false,
      number: null,
      candidates: ["250799537999", "250794003368"],
      message:
        "Hello TODO Growth, I'm interested in a 360° virtual tour for my business. Could you send me more information and a quote?",
    },
  },

  form: {
    // Sales policy pending: flip to true to require email. No markup changes needed.
    emailRequired: false,
    descriptionMin: 15,
    descriptionMax: 800,
  },

  submission: {
    // Backend not yet built. When null, the form reports honestly that
    // online submission is not connected and offers an email fallback.
    // Contract: README.md → "Submission endpoint contract".
    endpoint: null,
    timeoutMs: 15000,
  },

  tracking: {
    // No Pixel ID has been supplied. Never paste an unverified ID here.
    metaPixelId: null,
    // Pixel loads only when this returns true. No consent mechanism or
    // privacy notice exists yet, so tracking scripts stay off.
    consentGranted: () => false,
    debug: REVIEW_MODE,
  },

  /**
   * Real 360° tours found in the Phase 1 audit. `permission` must be
   * "approved" (in writing, covering paid ads) before a tour appears in the
   * production view. Pending tours are visible in review mode only.
   */
  tours: [
    {
      id: "grotta-standard",
      client: "Grotta Resort",
      title: "Standard Room",
      place: "Musanze, Rwanda",
      kuula: "https://kuula.co/share/collection/7dYf6?logo=0&info=1&fs=1&vr=1&sd=1&thumbs=1",
      poster: "grotta-standard",
      posterDir: "portfolio",
      // Facts from the client's own room page (grottaresort.rw/stay.html).
      facts: { size: "32 m²", guests: "2 guests", view: "Garden view" },
      description: "The essential room, seen exactly as a guest would find it: bed, bathroom and garden outlook.",
      // TODO Growth's own portfolio work, shown publicly as portfolio (owner
      // instruction). Paid-ad use is a separate decision.
      permission: "portfolio",
      showcase: true,
    },
    {
      id: "grotta-king-volcano",
      client: "Grotta Resort",
      title: "King Volcano View",
      place: "Musanze, Rwanda",
      kuula: "https://kuula.co/share/collection/7dYfN?logo=0&info=1&fs=1&vr=1&sd=1&thumbs=1",
      poster: "grotta-king-volcano",
      posterDir: "portfolio",
      // Facts from the client's own room page (grottaresort.rw/stay.html).
      facts: { size: "48 m²", guests: "2 guests", view: "Volcano panorama" },
      description: "Stand at the window and turn: the volcano view is the reason guests choose this room.",
      // TODO Growth's own portfolio work, shown publicly as portfolio (owner
      // instruction). Paid-ad use is a separate decision.
      permission: "portfolio",
      showcase: true,
    },
    {
      id: "grotta-king-pool",
      client: "Grotta Resort",
      title: "King Pool View",
      place: "Musanze, Rwanda",
      kuula: "https://kuula.co/share/collection/7dYG4?logo=0&info=0&fs=1&vr=1&sd=1&initload=0&thumbs=1",
      poster: "grotta-king-pool",
      posterDir: "portfolio",
      // Facts from the client's own room page (grottaresort.rw/stay.html).
      facts: { size: "48 m²", guests: "2 guests", view: "Pool and highlands" },
      description: "Look out towards the pool and the highlands, then turn to see the room around you.",
      // TODO Growth's own portfolio work, shown publicly as portfolio (owner
      // instruction). Paid-ad use is a separate decision.
      permission: "portfolio",
      showcase: true,
    },
    {
      id: "grotta-deluxe",
      client: "Grotta Resort",
      title: "Deluxe Room",
      place: "Musanze, Rwanda",
      kuula: "https://kuula.co/share/collection/7dY08?logo=0&info=0&fs=1&vr=1&sd=1&initload=0&thumbs=1",
      poster: "grotta-deluxe",
      posterDir: "portfolio",
      // Facts from the client's own room page (grottaresort.rw/stay.html).
      facts: { size: "64 m²", guests: "3 guests", view: "Panoramic view" },
      description: "More space, a day bed and a wide view: the things a gallery photo struggles to show.",
      // TODO Growth's own portfolio work, shown publicly as portfolio (owner
      // instruction). Paid-ad use is a separate decision.
      permission: "portfolio",
      showcase: true,
    },
    {
      id: "grotta-executive",
      client: "Grotta Resort",
      title: "Executive Room",
      place: "Musanze, Rwanda",
      kuula: "https://kuula.co/share/collection/7dYGH?logo=0&info=0&fs=1&vr=1&sd=1&initload=0&thumbs=1",
      poster: "grotta-executive",
      posterDir: "portfolio",
      // Facts from the client's own room page (grottaresort.rw/stay.html).
      facts: { size: "120 m²", guests: "4 guests", view: "360° highland view" },
      description: "The largest room, explored corner to corner before anyone arrives.",
      // TODO Growth's own portfolio work, shown publicly as portfolio (owner
      // instruction). Paid-ad use is a separate decision.
      permission: "portfolio",
      showcase: true,
    },
    {
      id: "svf",
      client: "Sustainable Villages Foundation",
      title: "Foundation walk-through",
      place: "Rwanda",
      kuula: "https://kuula.co/share/collection/7TRsP?logo=0&info=0&fs=1&vr=1&sd=1&initload=0&thumbs=1",
      poster: "svf",
      description: "A walk-through produced for the foundation, shared with the people who support its work.",
      posterMaxWidth: 640,
      permission: "pending",
    },
  ],
};

/** Tours that may be shown in the current mode. */
export function visibleTours() {
  return CONFIG.tours.filter((t) => t.permission === "approved" || t.permission === "portfolio" || REVIEW_MODE);
}

/** The real-rooms showcase: portfolio rooms only (SVF is a separate item). */
export function showcaseTours() {
  return visibleTours().filter((t) => t.showcase);
}

/** WhatsApp link, or null when the destination is not confirmed. */
export function whatsappHref() {
  const wa = CONFIG.contact.whatsapp;
  if (!wa.confirmed || !wa.number) return null;
  return `https://wa.me/${wa.number}?text=${encodeURIComponent(wa.message)}`;
}
