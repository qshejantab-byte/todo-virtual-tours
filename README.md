# TODO Growth: Virtual Tours

A static, framework-free, five-page experience for Meta (Facebook/Instagram) ad traffic.
The business source of truth is the *TODO Growth Meta Advertising & Landing Page Blueprint* (v1.0, 22 Oct 2026).
Phase 1 findings are in [VIRTUAL-TOURS-AUDIT.md](VIRTUAL-TOURS-AUDIT.md).

| Page | Route | Purpose |
|---|---|---|
| 01 Experience | `/` | The ad destination. Approved hero, both CTAs, a live demo room and the value story |
| 02 Explore | `/explore/` | Walk the three-viewpoint demonstration. Client tours appear in review mode only |
| 03 Industries | `/industries/` | Seven sectors, each with its own drawing, problem, use case and CTA |
| 04 Process | `/process/` | Capture → Create → Publish → Promote: your part, our part, what you receive |
| 05 Start a project | `/start/` | The enquiry form (`?type=hotel` etc. pre-fills the property type) |

- **Locally:** <http://localhost/virtualtourlandingpage/>
- **Old `/virtual-tours/` URLs:** 301 to the same path at the root (see `vercel.json`); query strings are kept.
- **No build step and no dependencies.** It runs on any static host, all paths are relative, and every page is a real, independently addressable URL.

```
index.html                          01 Experience
{explore,industries,process,start}/index.html
assets/css/site.css                 design system: "Plan & Aperture" (all styles, motion, view transitions)
assets/js/config.js                 ← every business decision, credential and permission lives here
assets/js/site.js                   shared chrome: nav marker, mobile menu, reveals, dock, contact gating, attribution carry
assets/js/main.js                   mounts whatever the current page contains
assets/js/room-art.js               artwork for the 12 walls of the demonstration property (drawn in code)
assets/js/demo-room.js              3D viewer engine, scenes, hotspots, walking, synced floor plan
assets/js/tour-theatre.js           real-spaces gallery: renders from config, one tap-to-enter Kuula iframe, aperture transitions, full screen, mobile immersive mode
assets/js/lead-form.js              validation, payload, honest submission states
assets/js/project-sheet.js          the live "project sheet" drawing on the Start page (decorative)
assets/js/submit.js                 submission adapter (the only backend touchpoint)
assets/js/tracking.js               Meta Pixel adapter (inactive until ID + consent)
assets/js/attribution.js            UTM / fbclid / landing-URL capture (first touch, per session)
assets/img/brand/                   TODO Growth logo (from the live todo.rw site)
assets/img/pending/                 client tour posters: NOT approved for public use (see below)
```

### Design system in one paragraph

Pages are plaster paper (`--paper`) drawn in ink (`--ink`), annotated in Space Mono, and cut through by dark *apertures* (`.night`) that show spaces from the inside. Signature components:
- `.rule` measurement dividers
- `.dim` dimension lines
- `.aperture` with crop marks
- the `.vp` viewpoint glyph
- a floor-plan mobile menu

Motion has three verbs:
- **drawn:** rules and plans stroke themselves in.
- **opened:** the hero irises open from its viewpoint, and the doorway arch rises.
- **walked:** the demo dollies between rooms, and the nav marker travels between pages through cross-document View Transitions.

Everything respects `prefers-reduced-motion`.

## Review mode vs production view

| URL | What you see |
|---|---|
| `localhost` / `127.0.0.1` (default), or `?review=1` | **Review mode.** A striped bar on every page lists what's unconfirmed. The six client tours appear on Explore with *Pending permission* badges so the full experience can be reviewed. |
| Any other host, or `?review=0` | **Production view.** Only approved tours appear. With none approved, Explore shows a "Real client tours, shared on request" block. No client names, images or Kuula URLs are in the DOM on any page. |

## Content rules applied

- **Positioning:** the blueprint's positioning rule is followed. The site sells an immersive customer experience (discovery, trust, conversations, decisions), not "360 photography".
- **Process names:** the process is **Capture → Create → Publish → Promote**, per the latest brief. The blueprint's Phase 3 says *Capture → **Build** → Publish → Promote*, and the owner should confirm which is final. Only the word on the Process page and the Experience process line changes.
- **Services:** the service components are exactly the blueprint's list: professional 360° capture, tour construction, interactive navigation, information hotspots where applicable, website embedding, mobile optimisation and supporting digital integration.
- **No price is published.** No approved price or package scope was found (the live site says "Price on request"). A "$250 starting price" must be confirmed with its defined scope before it is used anywhere.
- **No invented proof:** no testimonials, statistics, client results or guarantees. The industries page states that sectors are examples, not past clients. The demonstration property is labelled as an original illustration wherever it appears.

## Attribution across pages

The first touch (UTMs, fbclid, landing URL, referrer) is stored in `sessionStorage` on whichever page the visitor lands on, and read by the Start page's payload.

If storage is blocked, as in some in-app browsers, `site.js` appends the captured campaign parameters to internal links, so they still reach `/start/`. In that case `landing_page_url` is the page where the form was submitted.

## Launch gates

Each item is a config change in `assets/js/config.js`. No markup changes are needed.

| Gate | Current state | To clear it |
|---|---|---|
| Client tour permission (Grotta Resort ×5, SVF ×1) | `permission: "pending"`, so hidden in production | Get written permission that covers **paid advertising**, then set `permission: "approved"` per tour. If permission is refused, delete the tour entry and its files in `assets/img/pending/`. |
| WhatsApp number | `confirmed: false`, so no WhatsApp CTA renders in production | Sales confirms the number. Set `whatsapp.number` (digits only, e.g. `2507…`) and `confirmed: true`. CTAs then appear in the header, form aside, final CTA and mobile dock, with the prefilled message. |
| Lead backend | `submission.endpoint: null`. The form says plainly that nothing was sent and offers a prefilled email | Build the endpoint below and set `submission.endpoint`. |
| Email field policy | Optional (`form.emailRequired: false`) | Set to `true` if sales requires email. |
| Meta Pixel | `tracking.metaPixelId: null`, so no script loads | Add the verified Pixel/dataset ID **and** implement consent, then make `consentGranted()` return the visitor's real choice. |
| Privacy notice / consent | None exists, so no policy links and no banner are shown | Publish an approved privacy notice and a consent mechanism (see audit §7.3), then link it in the footer. |
| Indexing | `noindex` (paid-traffic page) | Remove the robots meta tag if organic indexing is wanted. |

## Submission endpoint contract

`submit.js` sends **one** request per enquiry:

```
POST <CONFIG.submission.endpoint>
Content-Type: application/json
Idempotency-Key: <event_id>          same value on retries of the same enquiry
```

```jsonc
{
  "event_id": "uuid",                 // reuse as the CAPI event_id for Lead (dedup with the browser Pixel)
  "service": "Virtual Tours",
  "page_id": "virtual-tours",
  "fields": {
    "name": "…", "business": "…",
    "phone": "+250781234567",         // normalised E.164 (null if it couldn't be normalised)
    "phone_raw": "078 123 4567", "whatsapp_ok": true,
    "email": null,                    // null when left blank
    "property_type": "hotel", "property_type_label": "Hotel, resort or lodge",
    "location": "…", "size": "…", "description": "…"
  },
  "attribution": {
    "utm": { "utm_source": "…", "utm_medium": "…", "utm_campaign": "…", "utm_content": "…", "utm_term": "…" },
    "fbclid": "…", "fbp": "…", "fbc": "fb.1.<ts>.<fbclid>",
    "landing_page_url": "…", "referrer": "…", "first_seen_at": "ISO", "page_url": "…"
  },
  "submitted_at": "ISO 8601",
  "consent": { "status": "not_collected", "note": "…" },
  "client": { "user_agent": "…", "review_mode": false }
}
```

Only parameters actually present in the landing URL are included. Nothing is defaulted.

**The backend must:**

1. Validate server-side, apply rate limiting and spam protection, and drop the request if the honeypot is filled (the browser already skips sending those).
2. **Store the lead first** in the system of record the business chooses (CRM, sheet or database: not yet decided).
3. Treat a repeated `Idempotency-Key` as the same lead, not a new one.
4. Respond **only after storage succeeds**:
   - `200 {"ok": true, "lead_id": "…"}`: the browser shows success and fires `Lead`.
   - `422 {"ok": false, "field_errors": {"phone": "message"}}`: errors are shown on those fields.
   - Any other status: the visitor sees "not received" and can retry.
5. Then notify sales (recipient not yet confirmed; nothing has been tested against `info@todo.rw`).
6. Optionally send Meta Conversions API `Lead` with `event_id` = the payload's `event_id`, plus `fbp`/`fbc`, hashed phone/email (only if disclosed in the privacy notice), `client_user_agent` and `event_source_url`. The access token stays server-side only.

The browser times out after `submission.timeoutMs` (15 s). A late success after a timeout is never shown as success.

## Tracking events

Every event is also recorded in `window.__vtEvents` for QA. Nothing reaches Meta until a Pixel ID is set and consent is granted.

| Event | When |
|---|---|
| `PageView` | Page load (once) |
| `ViewContent` | First time a visitor opens a real client tour on Explore (once per page view). Using the illustrated demo does **not** fire it |
| `Lead` | Only after the endpoint returns `{ok:true}`. `eventID` = payload `event_id` |
| `Contact` | Click on any `[data-contact]` link (WhatsApp/email), once per placement. Never blocks the link |
| `Schedule` | Not implemented (no booking tool) |

**CAPI is not operational.** It needs the backend above, a token, event forwarding and Events Manager testing.

## Asset provenance

| Asset | Source | Status |
|---|---|---|
| `brand/todo-logo-192.webp` | Published logo on www.todo.rw | TODO Growth's own brand asset |
| `pending/grotta-*-{200,640,1280}.webp` | Grotta room photos from the `grottachristmas` project, re-encoded | **Permission pending.** Shown in review mode only |
| `pending/svf-{200,640}.webp` | Kuula cover image of collection `7TRsP` | **Permission pending** (portfolio clause only; ads not confirmed). Review mode only |
| Demonstration property (lobby, restaurant, suite) | Drawn in code (`room-art.js`) | Original. Fictional, no client content; labelled as such on every page it appears |
| Industry plan drawings | Inline SVG in `industries/index.html` | Original, illustrative. Not client buildings |

Kuula tour URLs come from the live Grotta and SVF websites. Eagleview Farm is not presented as having a tour.

## Known limits

- **In-app browsers:** the viewer could not be tested inside the real Facebook/Instagram apps from this environment. Test on real Android and iPhone devices before launch. The direct-open links ("Full screen", "Open tour directly", "Taking a while?…") are the fallback when an in-app browser can't run the embed.
- **Fonts:** fonts load from Google Fonts. Self-host them if the privacy approach requires it.
