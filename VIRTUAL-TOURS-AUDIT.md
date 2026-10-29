# TODO Growth — Virtual Tours Landing Page: Phase 1 Audit

**Scope:** Virtual Tours Meta-ads landing page (`/virtual-tours`) only  
**Audit date:** 27 October 2026  
**Mode:** Read-only. No website files, configurations, DNS, hosting, analytics or integrations were changed. Nothing was installed, committed, pushed or deployed. The only file created is this report.

### How to read this report

| Label | Meaning |
|---|---|
| **[Verified]** | Directly observed in local files, git metadata or live HTTP responses during this audit. Evidence is cited. |
| **[Assumption]** | Reasonable inference that has not been confirmed. Needs checking before it is relied on. |
| **[Recommendation]** | Proposed approach. Needs approval before implementation. |

---

## 1. Executive summary

1. **The landing-page folder is empty.** [Verified] `c:\xampp\htdocs\virtualtourlandingpage\` contains only a 0-byte `index.html`. It is not a git repository. There is nothing to reuse here, and nothing to conflict with.
2. **The live TODO Growth website is not built from any local copy.** [Verified] `https://www.todo.rw` is a React SPA hosted on **Render** behind **Cloudflare** (`rndr-id` and `server: cloudflare` headers), last modified 2 October 2026. It has a `/portfolio` route, a dark Space Grotesk / Space Mono design and WhatsApp `+250 799 537 999`. The local `c:\xampp\htdocs\todo` repo, the `todo-html` repo and `Downloads\todo-main` all differ: they have different routes, a light “paper” theme and WhatsApp `+250 794 003 368`. **The source repository and deployment pipeline for the live site were not found and must be supplied.**
3. **A strong proof asset already exists.** [Verified] Five Grotta Resort room tours on Kuula are live on `grottaresort.rw/stay.html`. One Sustainable Villages Foundation (SVF) tour is live on `s-v-f.org`. All six Kuula links returned HTTP 200 and sent no frame-blocking headers. A well-built, accessible “tour theatre” component (tap-to-load, timeout, fallback, ARIA tabs) already exists in the `grotta-christmas` repo and is a good pattern to adapt.
4. **Permissions are only partly known.** [Verified] The SVF agreement allows TODO Growth to use completed work in its portfolio “unless otherwise agreed in writing”. No equivalent document was found for Grotta Resort or Eagleview Farm. Whether a portfolio clause covers *paid advertising* use is a legal question, not a verified fact.
5. **Eagleview Farm is not a verified virtual-tour example.** [Verified] The live portfolio lists a “360° virtual tour” deliverable for Grotta Resort and SVF, **but not for Eagleview Farm**. No Kuula or other tour embed was found on `eagleviewfarm.rw`.
6. **No tracking or privacy infrastructure exists today.** [Verified] The live bundle and local code contain no Meta Pixel, GTM, gtag, UTM handling, privacy policy, cookie or consent text. `/privacy` returns 200 only because every route falls back to the SPA.
7. **Lead delivery today is client-side EmailJS only.** [Verified] The live “quote” form sends name, company, phone, email, service, budget, launch date and summary through EmailJS. Nothing is stored, there is no CRM, and Conversions API is not possible from that setup.

**Headline recommendation:** [Recommendation] Build the four service landing pages as a **separate, lightweight static project** on a subdomain such as `go.todo.rw/virtual-tours`. The main site stays untouched. Add a small serverless lead endpoint that stores the lead *before* reporting success, notifies sales, and sends a deduplicated Conversions API `Lead` event. Use the Grotta tours as the hero proof once Grotta's written permission is confirmed.

---

## 2. Verified findings and evidence

### 2.1 Local environment

| Item | Finding | Evidence |
|---|---|---|
| Target folder | Empty; 0-byte `index.html`; no git repo | `ls -la virtualtourlandingpage` |
| Web server | XAMPP (Apache/PHP) local htdocs | `c:\xampp\htdocs\` layout, `index.php`, `xampp/` |
| `htdocs/todo` | Vite 7 + React 19 + TypeScript + Tailwind v4 + shadcn/Radix, react-router 7, react-hook-form, zod, `@emailjs/browser`. Scripts: `vite dev`, `vite build`, `vite preview`, `eslint .`. Remote `github.com/qshejantab-byte/todo`, last `origin/main` commit 9 June 2026. **The working tree has uncommitted changes** (index.html, App.tsx, several pages). | `package.json`, `git log`, `git status` |
| `htdocs/todo` hosting config | `wrangler.jsonc` points at `src/server.ts` (missing) and is named `tanstack-start-app`. This is a leftover from the Lovable template, not a working deploy config. | `wrangler.jsonc`, `.lovable/project.json` |
| `htdocs/todo-html` | Older static HTML version. Remote `qshejantab-byte/todo-html`. | `git remote -v` |
| `Downloads/todo-main` | Another snapshot of the React repo. Its routes differ from both the local repo and the live site. | `App.tsx` diff |
| Grotta repos | `grotta` (static HTML) and `grotta-christmas` (remote `qshejantab-byte/grotta-christmas`, includes the 360° tour theatre). `grotta-christmas` has uncommitted changes and deleted video files. | `git status` |

### 2.2 Live environment

| Item | Finding | Evidence |
|---|---|---|
| Domain | `todo.rw` redirects 301 to `www.todo.rw` | `curl -I` |
| Hosting | Render (`rndr-id` header) behind Cloudflare (`cf-cache-status: HIT`). HTML cache `s-maxage=300`. | Response headers |
| Last deploy | `last-modified: Fri, 02 Oct 2026` | Response headers |
| Routes | `/`, `/services`, `/packages`, `/industries`, `/portfolio`, `/about`, `/discovery`, `/contact` | Live `sitemap.xml` and bundle |
| Soft 404s | Any unknown path (including `/virtual-tours` and `/privacy`) returns **200** with the SPA shell | `curl` status codes |
| robots.txt | 404 | `curl -I /robots.txt` |
| Contact (live) | `richie@todo.rw`, WhatsApp `https://wa.me/250799537999`, legal name “TODO Growth Ltd.”, pricing stance “Price on request” | Live JS bundle constants |
| Tracking | **None found**: no `fbq`, `connect.facebook.net`, GTM, gtag, or UTM code | `grep` of live HTML and bundle |
| Privacy | **No** privacy, cookie or consent text in the live bundle | `grep` of live bundle |
| Lead forms | EmailJS (client-side), with a “discovery” template and a “quote” template. Quote payload fields: `name, company, phone, email (reply_to), service, budget, launchDate, summary`. | Live bundle |
| Live positioning | Services are grouped into the stages Present / Attract / Convert / Operate. Virtual Tours sits in “Attract” (accent `#C8A8E9`). Copy: “Let guests and buyers explore your space before they arrive.” | Live bundle |

> **Conflict to resolve:** the WhatsApp number differs between the live site (`+250 799 537 999`) and the local repos (`+250 794 003 368`). [Assumption] The live number is current. Sales must confirm which number the landing page should use.

### 2.3 Reusable functionality

| Candidate | Reuse? | Notes |
|---|---|---|
| Grotta “Step Inside” 360° tour theatre (`grottachristmas/stay.html`, markup around line 1500, script around line 2637) | **Yes, as a pattern** [Recommendation] | Shows a poster first and loads the Kuula iframe only after a tap. It has a 15 s ready timeout, a reachability probe, an offline handler, a “Try again / Open in new tab” fallback, ARIA tablist and a live-region announcer. This is exactly what in-app browsers need. Adapt the code; do not copy Grotta pricing or booking links. |
| Live site media registry | **Yes, as a practice** | Each asset in the live bundle carries `status: real/temporary` and a `source` note. The landing page should keep the same kind of provenance list. |
| Live quote-form field set | **Partly** | The field names match an existing EmailJS template. Reuse that template only if the business keeps EmailJS (see §6). |
| Local `todo` design system (`index.css`, `components/system/*`) | **No** | It is a different visual direction from the live brand. It is also an unpublished branch of work. |
| Main site routing | **No** | Adding `/virtual-tours` to the main site would mean modifying it, which is out of scope, and its source is unavailable. |

---

## 3. Relevant assets and existing components

### 3.1 Virtual-tour embeds

| Asset | Status | Where seen | Usage permission |
|---|---|---|---|
| Kuula `collection/7dYf6`, “Standard room”, Grotta | 200 OK | `grottaresort.rw/stay.html`, `grottachristmas/stay.html` | **Unknown.** No Grotta agreement found. |
| Kuula `collection/7dYfN`, King Volcano View, Grotta | 200 OK | same | Unknown |
| Kuula `collection/7dYG4`, King Pool View, Grotta | 200 OK | same | Unknown |
| Kuula `collection/7dY08`, Deluxe Room, Grotta | 200 OK | same | Unknown |
| Kuula `collection/7dYGH`, “Executive Room”, Grotta | 200 OK | same | Unknown |
| Kuula `collection/7TRsP`, “Sustainable Villages Foundation” | 200 OK | `s-v-f.org` homepage | **Portfolio use permitted** under SVF agreement §8 (“may use completed work in its portfolio unless otherwise agreed in writing”). Whether this covers paid ads is **unconfirmed**. |
| Eagleview Farm tour | **Not found** | Not on `eagleviewfarm.rw`, not listed as delivered in the live portfolio | Not applicable |

[Assumption] It is unknown which Kuula account owns these collections: TODO Growth's or the client's. If a client owns the account, they can unpublish a tour and break the ad's main proof point without warning.

### 3.2 Photography and imagery

| Asset | Location | Notes |
|---|---|---|
| Grotta room photos: `standard.JPG`, `deluxeroom.jpg`, `kingpoolview.png`, `kingvolacnoview.png`, `kkingvolc.JPG`, `kingroom.png`, `nkingroom.png`, `masrooms.jpg` | `htdocs/grottachristmas/images/` | 0.75–2.8 MB each, so they need conversion to WebP/AVIF. Usable as tour posters **once permission is confirmed**. |
| ~60 Grotta photos `AV7I*.jpg` | `htdocs/grotta/images/`, `grottachristmas/images/` | Professional shoot. [Assumption] TODO Growth produced them. The live site's registry describes some Grotta photos as “supplied by TODO Growth (September 2026)”. Rights are unconfirmed. |
| Live-site Grotta/Eagleview website screenshots (`grotta-desktop-*.webp`, `eagleview-*.webp`) | `www.todo.rw/assets/` | Screenshots of websites, not tour imagery. Only useful as secondary “we also build websites” proof. |
| Front-end-forge `WeddingsPage.tsx` “360° Virtual Tour” CTA | `front-end-forge-main` | A placeholder button only. It uses third-party AI-generated image URLs (`lh3.googleusercontent.com/aida-public`). **Do not use.** |
| Videos | None relevant found locally | The `grotta-christmas` macro videos are deleted in its working tree and are seasonal anyway. |

### 3.3 Brand assets

| Asset | Location | Notes |
|---|---|---|
| Logo 1024×1024 PNG (RGBA) | `htdocs/todo/src/assets/LOGO.png` | Best local master. No SVG version found. |
| Logo 160×160 PNG | `htdocs/todo/src/assets/logo-160.png` | |
| Logo 1024×1024 JPEG | `htdocs/todo-html/LOGO.png` | JPEG with a `.png` extension and no transparency. **Avoid.** |
| Live logo `logo-192-*.webp` | `www.todo.rw/assets/` | What is currently published. |
| Brand guidelines | **Not found** | No guideline PDF, font licence or colour spec anywhere searched. |

**Live brand tokens observed** [Verified, from the live bundle] (these are not formally “approved”):
- Background `#0b0d17`, raised `#10131f`, deepest `#07080f`; text `#f5f5f0` with 76% and 60% opacity for body and muted text.
- Accents: yellow `#E8C547`, blue `#7DB8E8`, teal `#5DD6B3`, lilac `#C8A8E9` (Virtual Tours / “Attract”), coral `#E87D7D`.
- Type: **Space Grotesk** (headings/body) and **Space Mono** (labels).
- Wordmark rendered as “TODO **Growth**” with “Growth” in a lighter weight.

---

## 4. Brand and visual direction

**Consistency findings** [Verified]: there are at least three TODO visual identities on disk: the live dark Space Grotesk site, the local light “paper + spectrum tiles” system with Bricolage/Schibsted fonts, and the older `todo-html`. Only the live one is public. Ads that send people to a page that looks unlike `todo.rw` would undermine trust.

**Recommended direction** [Recommendation], working name **“Dark room, open door”**:
- Use the **live palette and Space Grotesk/Space Mono** so the page reads as unmistakably TODO Growth. Use **lilac `#C8A8E9`** as the Virtual Tours accent, as the live site already does, with yellow `#E8C547` reserved for the primary CTA only.
- Treat the tour as the hero, not decoration. Use a near-black stage with a single large, cinematic tour poster that you tap to “step inside”. A slow, reduced-motion-safe pan suggests 360° before any interaction. On desktop, a subtle viewfinder or compass motif frames the stage.
- Use Space Mono for small technical labels such as “360° · DRAG TO LOOK AROUND” and “01 / 05 STANDARD ROOM”. This gives a premium, instrument-like feel without inventing a new identity.
- Use real photography only. No stock imagery of generic hotels, and no AI-generated interiors presented as client work.
- Keep it restrained: one accent colour per section, generous negative space, and no carousel autoplay.

---

## 5. Proposed technical architecture

### 5.1 Hosting and routing options

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A. Subdomain (recommended)** | Separate static project at `go.todo.rw` serving `/virtual-tours` and later the other three pages, deployed as its own Render static site or Cloudflare Pages project | Zero risk to the main site. Independent deploys. Fastest page. Easy to A/B test. One project serves all four landing pages. | Needs one new DNS record (a business-owner/admin action). Main-site analytics are separate unless shared. |
| B. Cloudflare Worker path proxy | `todo.rw/virtual-tours*` proxied to the landing project | Keeps the exact `todo.rw/virtual-tours` URL | Touches Cloudflare routing for the production domain. More moving parts. Worker routes must not interfere with the SPA. |
| C. Route inside the main SPA | Add `/virtual-tours` to the live React app | Shared components | The live source is unavailable. Modifies the main site (out of scope). Heavier JS bundle for ad traffic. |

**Recommendation:** Option A with the URL `https://go.todo.rw/virtual-tours`. If the owner insists on `todo.rw/virtual-tours`, use Option B later. The landing project does not change, only the routing in front of it.

### 5.2 Stack

[Recommendation] Build with **framework-free, static HTML + CSS + a small vanilla JS module set**, optionally bundled with Vite in multi-page mode for hashed assets and image processing.
- The reason is that Meta in-app browsers on mid-range Android over 3G/4G are the main audience, so the less JavaScript the better. Target under 40 KB of gzipped JS before the tour loads.
- The Grotta tour theatre is already vanilla JS and ports directly.
- Each of the four service pages is one HTML file plus a shared `landing.css` and `landing.js`.

**Proposed layout** (to be created in Phase 2 only, after approval):
```
virtualtourlandingpage/          (or a renamed repo, e.g. todo-landing-pages)
  virtual-tours/index.html
  assets/css/landing.css
  assets/js/{tour-theatre,lead-form,tracking,consent}.js
  assets/img/…                   (WebP/AVIF, multiple widths, provenance list)
  privacy/index.html             (if the main site still has no policy)
  functions/ or worker/lead.js   (serverless lead endpoint; see §6)
  ASSETS.md                      (every asset: source, owner, permission status)
```

### 5.3 Lead endpoint

[Recommendation] Use one small serverless function (a Cloudflare Worker or Render web service) at `POST /api/lead`. It does the following, in order:
1. Validates the payload server-side, applies a honeypot check and rate limiting, and optionally Cloudflare Turnstile.
2. **Stores the lead** in Google Sheets, Airtable, a HubSpot/Zoho CRM or a database (owner to choose).
3. Sends a notification email to the lead owner, plus an optional WhatsApp/Slack alert.
4. Sends a Meta **Conversions API** `Lead` event with the same `event_id` as the browser Pixel event.
5. Returns `200` **only if step 2 succeeded**. A notification failure is retried or logged, but it never loses the lead.

Secrets (CAPI access token, CRM keys) live only in the platform's secret store, never in client code.

---

## 6. Lead-capture plan

### 6.1 Fields

| Field | Required | Type / validation | Notes |
|---|---|---|---|
| Full name | Yes | text, 2–80 chars, `autocomplete="name"` | |
| Business / organisation | Yes | text, 2–120 chars, `autocomplete="organization"` | |
| Phone / WhatsApp | Yes | `type="tel"`, `inputmode="tel"`, default `+250`, normalised to E.164 | Add a “This number is on WhatsApp” checkbox (default on) |
| Email | **Pending sales policy** | `type="email"` | The live quote form collects email. Recommend *optional*, because fewer fields convert better on mobile. Owner to decide. |
| Service interest | Yes | Pre-set to “Virtual Tours” and sent as a hidden field; also shown as a visible chip | Keeps leads comparable across the four landing pages |
| Property type | Yes | select: Hotel/lodge · Restaurant/café · Event venue · Real estate (listing/development) · Office/corporate · School/NGO/institution · Retail/showroom · Other | List to be confirmed by sales |
| Location | Yes | text (city/district), e.g. “Musanze” | Affects travel cost |
| Size | Yes | select ranges, e.g. number of spaces/rooms (1–5 · 6–15 · 16–40 · 40+) **or** approx. m² | Sales to confirm which unit their pricing uses |
| Project description | Yes | textarea, 20–600 chars | Placeholder example only, not pre-filled |
| Timeline | Optional | select: ASAP · within 1 month · 1–3 months · exploring | Helps qualification [Recommendation] |
| Consent / privacy acknowledgement | Yes | checkbox + link to privacy notice | See §7.3 |
| Hidden attribution | Auto | `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, _fbp, _fbc, landing_page_url, referrer, first_seen_at, page_variant` | |
| Honeypot | Auto | hidden field that must stay empty | |

### 6.2 Submission states (no fake success)

- **Submitting:** disable the button and show “Sending…” with `aria-busy`.
- **Success (endpoint returned 200 and lead stored):** replace the form with a thank-you panel that sets clear expectations, e.g. “We'll contact you on WhatsApp within one working day”. The response time must be confirmed by sales. Offer a WhatsApp button to continue now, move focus to the heading, and fire Pixel `Lead`. Optionally push the URL `?submitted=1` or `/virtual-tours/thank-you` so Meta custom conversions can use it.
- **Failure:** keep everything the user entered, show an inline error with a **pre-filled WhatsApp link that contains their details**, and **do not fire `Lead`**.
- **Offline:** detect `navigator.onLine === false` and show the same fallback.

### 6.3 Destination, ownership and notifications

- [Verified] The current destination is EmailJS, which sends to an inbox. The live constants suggest `richie@todo.rw`, but the recipient inside the EmailJS template could not be verified without EmailJS dashboard access.
- [Recommendation] The owner must name a **lead owner** (person), a **backup**, a **response SLA**, and the **system of record** (sheet or CRM).
- **Interim fallback:** if a serverless endpoint is not approved, a dedicated EmailJS “virtual-tours” template could be used, with `Lead` fired only after `emailjs.send()` resolves. Limitations: no storage, no CAPI, client-side quota and spam exposure, and plan limits that need checking in the EmailJS dashboard. This is acceptable only for a short pilot.

---

## 7. Analytics, tracking and privacy

### 7.1 Meta Pixel events

| Event | Trigger | Parameters | Dedup |
|---|---|---|---|
| `PageView` | Page load, **after consent** (see §7.3) | standard | Browser only, or also CAPI with `event_id` |
| `ViewContent` | **Once per page view**, when the user starts an interactive tour (taps “View Example” or “Begin 360° Tour”) | `content_name: "Virtual Tours"`, `content_category: "service_landing"`, `content_ids: ["<tour-id>"]` | Guard flag so it fires only once per session |
| `Lead` | **Only** after the endpoint confirms storage | `content_name`, `property_type`, `value`/`currency` only if sales provides a lead value | Same `event_id` (UUID) sent in the Pixel `eventID` and in CAPI; a submit lock prevents double clicks |
| `Contact` | Click on any WhatsApp link (hero, sticky bar, thank-you, footer) | `content_name: "whatsapp"`, `placement` | Fire once per placement per session; never block navigation |
| `Schedule` | **Not implemented** unless a booking tool (e.g. Calendly) is added and confirmed | | |

### 7.2 UTM and attribution capture

- Capture on first load: `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid`, the full landing URL and `document.referrer`.
- Persist in `sessionStorage` (first-touch) so values survive in-page navigation. Wrap the access in try/catch, because some in-app WebViews restrict storage.
- Build `_fbc` from `fbclid` when the cookie is absent (`fb.1.<timestamp>.<fbclid>`) and send `_fbp`/`_fbc` to CAPI.
- Use a Meta ads URL-parameter template, e.g. `utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}`. To be agreed with the ads manager.

### 7.3 Consent and privacy

- [Verified] No privacy notice or consent mechanism exists on `todo.rw`.
- [Assumption, needs legal confirmation] Rwanda's **Law No. 058/2021 on the protection of personal data and privacy** applies. It requires a lawful basis or consent for processing, transparency about purposes, and may require **registration with the National Cyber Security Authority (NCSA)** as a data controller. If ads also reach EU residents (e.g. the SVF-related audience in Germany), GDPR/ePrivacy consent rules for tracking cookies apply.
- [Recommendation]
  - Add a concise **privacy notice** covering what is collected, why, who receives it (TODO Growth and its processors: Meta, the email/CRM provider), retention, rights and contact.
  - Add a **consent banner** that loads the Pixel only after acceptance, or uses Meta's `fbq('consent','revoke'/'grant')`. CAPI events must respect the same choice.
  - Use **Advanced Matching** (hashed email/phone) only if it is disclosed in the notice.

### 7.4 Conversions API feasibility

- **Feasible** with the §5.3 endpoint. It requires: a Meta Business Manager admin to create/confirm the **Pixel/dataset ID**, generate a **CAPI access token**, and **verify the `todo.rw` domain**. If Option A is chosen, add the subdomain to the domain allowlist. Test with the Events Manager **Test Events** code before going live.
- **Not feasible** with EmailJS alone.

---

## 8. Proposed page structure and conversion journey

The journey: the ad promises “step inside” → the page proves it within seconds → explains the offer → collects a qualified enquiry, with WhatsApp always one tap away.

| # | Section | Purpose | Content source |
|---|---|---|---|
| 0 | **Slim header** | Logo + WhatsApp icon + “Get a Virtual Tour”. **No main-site navigation** (avoids leakage). | Brand |
| 1 | **Hero** | H1 **“Let Customers Step Inside Before They Visit.”** One-line subhead. Primary CTA **“Get a Virtual Tour”** (to the form). Secondary CTA **“View Example”** (opens the tour stage). The tour poster is visible in the first viewport on mobile. | Approved headline; subhead TBC |
| 2 | **Interactive proof: tour stage** | Tap-to-load Kuula tour with 2–3 selectable examples, plus a fallback. The highest-value moment on the page. | Grotta and/or SVF (**permission required**) |
| 3 | **Customer problems** | 3 short problems, e.g. photos show only selected angles; out-of-town or diaspora customers can't visit; staff repeat the same questions. Wording to be approved. | Draft copy |
| 4 | **How it works** | 4 steps: Brief & quote → On-site capture → Build & brand the tour → Deliver link + website embed. Must match the real process. | **Owner to confirm** |
| 5 | **What you get (deliverables)** | Only items TODO Growth actually delivers, e.g. hosted tour link, website embed, social share link, hotspots/branding. | **Owner to confirm**. Do not invent. |
| 6 | **Industries** | Hospitality · Real estate · Event venues · Institutions/NGOs · Retail/showrooms. Links to the matching property type in the form. | Live-site industries plus sales input |
| 7 | **Case studies** | Grotta Resort (room tours on its website) and SVF (organisation tour). Facts only: what was delivered and where it lives. **No metrics unless supplied and verified.** | Live portfolio (verified deliverables) |
| 8 | **Trust signals** | Real client names/logos (with permission), Rwanda-based team, transparent process, response-time promise. **No fabricated testimonials or stats.** | Owner |
| 9 | **FAQ** | Price basis (“Price on request” on the live site), turnaround, hosting/ownership, embedding, re-shoots. | **Owner answers required** |
| 10 | **Lead form** | §6 | |
| 11 | **Final CTA** | Restate the promise + “Get a Virtual Tour” + WhatsApp | |
| 12 | **Footer** | TODO Growth Ltd., contact, privacy notice link, link to `todo.rw` | |
| — | **Sticky mobile bar** | Appears after the hero scrolls away: “Get a Virtual Tour” plus a WhatsApp icon button. Hidden while the form is in view and while the tour is fullscreen. | |

**Mobile priority** [Recommendation]: at 360×640, the H1, both CTAs and the top of the tour poster must be visible without scrolling. “View Example” scrolls to and activates the stage with one tap.

---

## 9. Mobile, in-app browser and performance plan

### 9.1 Risks specific to 360° embeds in the Facebook and Instagram in-app browsers

| Risk | Mitigation |
|---|---|
| Heavy WebGL iframe causes slow loads or crashes on low-memory Android | Never auto-load. Show a poster image and load the iframe only after a tap. Unload it on close or tab switch (the Grotta pattern already sets `about:blank`). |
| Scroll trapping: dragging the panorama hijacks page scroll | The tour sits in a bounded stage with a visible “Close tour” control. The iframe is only interactive after an explicit start. Keep page margins around the stage so it can be scrolled past. |
| The Fullscreen API is unreliable or blocked in iOS WebViews | Provide **“Open full screen”** as a link to the Kuula share URL in a new tab; the in-app browser handles it. Do not depend on `fs=1`. |
| Gyroscope/motion needs permission on iOS and may be blocked in WebViews | Treat drag as the primary interaction. Motion is a bonus. |
| Kuula unreachable or slow (Rwandan mobile networks) | Use a reachability probe, a 15 s timeout, and a fallback with retry, “open in new tab” and WhatsApp. |
| Third-party cookies/storage blocked inside the iframe | Kuula viewing does not need them. [Assumption] To be checked in device testing. |
| `logo=-1` (hide Kuula branding) may depend on the Kuula plan | [Assumption] Check against the account's plan. |
| Client unpublishes a tour | Prefer tours hosted on a **TODO-owned Kuula account**, and monitor the URLs. |

### 9.2 Responsive and accessibility testing

- Widths: **320**, 360, 375, 390, 414, 768, 1024, 1280, 1440+. Both orientations for the tour stage.
- Devices: real Android (low/mid-range) in the **Facebook and Instagram in-app browsers**, iPhone in-app browsers, Chrome Android, Safari iOS, and desktop Chrome/Edge/Firefox/Safari.
- Keyboard: every control is reachable, there are visible focus states (3:1 contrast or better), the tour tabs follow the ARIA tabs pattern, and Esc closes the tour.
- `prefers-reduced-motion`: no poster pan and no scroll-reveal animation.
- Forms: labels always visible (not placeholder-only), errors linked via `aria-describedby`, correct `inputmode`/`autocomplete`, touch targets of at least 44×44 px, and no zoom-on-focus (16 px or larger inputs).
- Colour contrast: body text at least 4.5:1 on `#0b0d17`.

### 9.3 Performance budget

[Recommendation] Measured on a mid-range Android over 4G:
- LCP under 2.5 s, CLS under 0.1, INP under 200 ms.
- Initial page weight under 500 KB, excluding the tour. Hero poster under 120 KB (AVIF/WebP with `srcset`, explicit width/height, `fetchpriority="high"`).
- Fonts: only the needed weights of Space Grotesk/Space Mono, preloaded, `font-display: swap`, ideally self-hosted.
- Pixel loaded after consent. No other third-party scripts at launch.
- Convert the current Grotta PNGs (2–3 MB) to under 150 KB per rendition.

---

## 10. Missing information, assets, permissions and access

| # | Item | Needed from | Blocks |
|---|---|---|---|
| 1 | **Source repo + deploy access for live `todo.rw`** (Render, Cloudflare) | Owner/admin | Architecture decision; consistent brand tokens |
| 2 | **Written permission from Grotta Resort** to use its tours and photos in **paid Meta ads** | Owner, then Grotta | Hero proof (Phase 2) |
| 3 | Confirmation that the SVF agreement's portfolio clause covers ads, or explicit SVF consent | Owner, then SVF | SVF example |
| 4 | Which Kuula account owns the collections; access to it | Owner | Tour reliability |
| 5 | Eagleview Farm: does a virtual tour exist? Permission? | Owner | Eagleview mention |
| 6 | Approved logo master (ideally SVG), any brand guidelines | Owner | Final design |
| 7 | Meta Business Manager: Pixel/dataset ID, CAPI token, domain verification, ad account access | Ads admin | Tracking |
| 8 | Lead owner, backup, response SLA, system of record (sheet/CRM) | Sales | Form go-live |
| 9 | Email-field policy; property-type list; size unit for pricing | Sales | Form spec |
| 10 | Correct WhatsApp number and a prefilled message | Sales | WhatsApp CTA |
| 11 | Real process steps, deliverables, turnaround, pricing stance, FAQ answers | Owner | Sections 4, 5, 9 |
| 12 | Any genuine client quotes or results, with written consent | Owner | Trust section (optional) |
| 13 | Privacy notice approval; NCSA registration status | Owner/legal | Tracking go-live |
| 14 | DNS change for `go.todo.rw` (if Option A) | Cloudflare admin | Deployment |
| 15 | EmailJS dashboard access (only if EmailJS is the interim path) | Owner | Interim lead delivery |

---

## 11. Risks and mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Using client tours/photos in ads without permission | Medium | High (legal/relationship) | Get written permission before launch. Keep the `ASSETS.md` provenance list. Have a placeholder plan ready. |
| Leads lost (EmailJS failure, spam filter, quota) | Medium | High | Serverless endpoint that stores before success. Retry notifications. Daily lead reconciliation for the first 2 weeks. |
| Inflated or duplicate `Lead` events degrade ad optimisation | Medium | High | Fire only on confirmed storage. Shared `event_id`. Submit lock. Test Events validation. |
| Tracking without consent or privacy notice | High (today) | Medium–High | Consent banner plus privacy notice before the Pixel goes live. |
| 360° embed fails in in-app browsers | Medium | High (proof is the core) | Tap-to-load, fallback, “open in new tab”, WhatsApp fallback, real-device QA. |
| Brand mismatch with `todo.rw` | Medium | Medium | Use live tokens and fonts. Owner design review. |
| Wrong WhatsApp number | Medium | High | Sales sign-off. Test click-through before launch. |
| Soft-404 behaviour on `todo.rw` confuses links to `todo.rw/virtual-tours` | Low | Medium | Use the subdomain URL in ads, or ensure the main site handles the route. |
| Accidental changes to dirty local repos (`todo`, `grotta-christmas`) | Low | Medium | Phase 2 works only in the landing-page folder or repo. Copy patterns, never edit those repos. |
| Kuula tour removed or plan lapses | Low–Medium | High | TODO-owned account, uptime check, fallback poster plus WhatsApp. |

---

## 12. Prioritised implementation plan and acceptance criteria

> Nothing below starts until this audit is approved.

**P0: Decisions and access (before any build)**
- Owner answers §13. Permissions for Grotta/SVF are confirmed in writing. Hosting option chosen. Lead destination chosen. Meta access granted.
- *Acceptance:* a signed-off decision list; `ASSETS.md` drafted with every asset marked *approved*, *pending* or *excluded*.

**P1: Static page skeleton and content**
- Folder/repo setup, HTML for all §8 sections, live brand tokens, real copy (approved), responsive layout from 320 px.
- *Acceptance:* no horizontal scroll at 320–1440 px. H1 and both CTAs visible above the fold at 360×640. Lighthouse Accessibility at least 95. No placeholder or invented claims.

**P2: Tour stage**
- Port the Grotta tour-theatre pattern: poster → tap → iframe, a tour switcher, close, fallback, “open full screen”.
- *Acceptance:* the iframe never loads before user action. The fallback appears within 15 s on a blocked network. Works in the FB and IG in-app browsers on one Android and one iPhone. Keyboard-operable. Reduced motion respected.

**P3: Lead form and endpoint**
- Fields per §6, client and server validation, storage-first endpoint, notifications, honeypot/rate limit, success/failure/offline states.
- *Acceptance:* 10 test submissions stored and notified with 100% match. A forced storage failure shows the error state and **does not** fire `Lead`. Hidden UTM fields populated. Data is never lost on failure (inputs retained).

**P4: Tracking and consent**
- Consent banner, privacy notice, Pixel (`PageView`, `ViewContent`, `Lead`, `Contact`), CAPI `Lead` with dedup, UTM/fbclid capture.
- *Acceptance:* Events Manager Test Events shows each event once per action. `Lead` is deduplicated (browser + server, same `event_id`). No Pixel requests before consent. Declining consent sends no Meta events.

**P5: Performance and QA**
- Image pipeline, font subsetting, device matrix (§9.2).
- *Acceptance:* LCP under 2.5 s and CLS under 0.1 on a mid-range Android over 4G (WebPageTest/Lighthouse mobile). All WhatsApp links open the correct number with the prefilled text. Cross-browser checklist signed off.

**P6: Launch (owner-approved)**
- DNS/route, deploy, Meta domain verification, uptime monitor on the page and Kuula URLs, lead reconciliation for the first 14 days.
- *Acceptance:* owner sign-off; a live test lead received end-to-end; ads URL parameters verified in a stored lead.

---

## 13. Questions requiring business-owner approval

1. **Hosting:** approve `go.todo.rw/virtual-tours` (separate project), or must the URL be exactly `todo.rw/virtual-tours`?
2. **Live site source:** where is the source repo for the deployed `todo.rw`, and who manages Render and Cloudflare?
3. **Permissions:** do we have, or can we get, written permission from **Grotta Resort** to use its 360° tours and photos in paid Meta ads? Does SVF's agreement cover ads, or should we ask?
4. **Eagleview Farm:** did TODO Growth produce a virtual tour for Eagleview? If so, where is it hosted, and is it approved for use?
5. **Kuula:** which account owns the tours, and what plan is it on?
6. **WhatsApp:** which number is correct, `+250 799 537 999` (live site) or `+250 794 003 368` (local code)? Who answers it?
7. **Lead handling:** who owns virtual-tour leads, what is the response-time promise, and where should leads be stored (Google Sheet, CRM, other)?
8. **Email field:** required, optional or omitted?
9. **Qualification:** confirm the property-type list, the size unit used for quoting (rooms/spaces vs m²), and whether to ask for a timeline or budget.
10. **Offer content:** confirm the real process steps, deliverables, typical turnaround, and how pricing is presented (keep “Price on request”?).
11. **Proof:** are there any genuine client quotes or measurable outcomes we may publish, with written consent? If not, the page will use factual project descriptions only.
12. **Privacy and legal:** may we publish a privacy notice and consent banner? Is TODO Growth Ltd. registered with NCSA as a data controller?
13. **Meta access:** who can provide the Pixel/dataset ID, a CAPI token and domain verification?
14. **Booking:** should a booking tool be added (which would enable the `Schedule` event), or is the form plus WhatsApp sufficient for Phase 2?
15. **Brand:** is the live dark Space Grotesk identity the approved brand, and is a vector (SVG) logo available?

---

*End of Phase 1 audit. Awaiting approval before any implementation.*
