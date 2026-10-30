# TODO Growth Virtual Tours: Creative Direction Audit

**Scope:** all five pages. Audit only; no project files were changed.
**Date:** 29 October 2026
**Evidence key:** **[V]** verified in the rendered site · **[M]** measured by script in headless Chrome · **[H]** hypothesis, to be confirmed.

---

## 1. Executive diagnosis: five reasons it doesn't feel finished

1. **Two design systems are stitched together.** The cinematic dark system (navigation, Experience hero, Real Spaces showcase, tour viewer, footer) was built last and is the strongest work. Everything between the hero and the footer still uses the earlier paper "drawing set" system. On Experience, the page drops from dark to paper after the showcase and stays paper for five sections until the footer **[V]**. Industries, Process and Start are almost entirely paper, framed by a dark nav and a dark footer **[V]**. Visitors feel two websites taking turns.
2. **One section template is repeated until it becomes wallpaper.** Most sections are a numbered ruler, then a 62 px two-line H2 on the left, then a lead paragraph on the right. Experience uses it five times in a row (sections 02–06) **[V][M]**, and every inner-page header repeats it. When everything has the same shape, nothing feels important.
3. **Decorative notation has turned into noise.** Numbering appears in at least eight independent sequences:
   - navigation 01–04
   - section rulers 01–06
   - rooms 01–05
   - industries 01/07
   - stages 01–04
   - deliverables 01–07
   - next steps 01–03
   - viewpoints VP 01–03

   The Experience page has **85 visible Space Mono text nodes**, **46 text nodes under 12 px** and **28 distinct font size/family/weight combinations** at 1440 px **[M]**. The architectural language that was meant as the signature now reads as clutter, and small mono labels hurt legibility.
4. **The same arguments repeat across pages, which inflates length without adding value.**
   - The seven deliverables appear four times: Experience "What you receive", the Explore ledger, Process stage tags and Process "What you receive" **[V]**.
   - The four process steps appear twice on Experience (the giant type line plus columns) and twice on Process (overview strip plus stages) **[V]**.
   - The headline "Let customers step inside before they visit" opens the hero and closes the footer of every page **[V]**.
   - The Real Spaces showcase is identical on Experience and Explore **[V]**.

   Experience is **8.7 screens long at 1440 px, 11.4 at 390 px and 13.1 at 360 px** **[M]**.
5. **The rhythm is uneven: dense in places, empty in others.**
   - **Experience:** empty bands of roughly 250–300 px sit below the compare toggle and below the process columns (1440 px) **[V]**.
   - **Industries:** a single 6,423 px block (7.1 screens at desktop, 9.2 at 390 px) repeats one structure seven times **[M]**.
   - **Explore:** a thin 274 px paper strip is sandwiched between the dark nav and the dark viewer **[M][V]**.
   - **Start:** the footer, with a second "Get a Virtual Tour" CTA and a giant statement, sits directly below the submit button, competing with the form it should support **[V]**.

**Most important single problem:** problem 1. Until one world (dark/immersive or paper/drawn) is the base material and the other a deliberate accent, no amount of polish will make the site feel art-directed.

---

## 2. Inspection coverage

| Item | What was done |
|---|---|
| Local server | `http://localhost/virtualtourlandingpage/virtual-tours/` responded **200** at the start of the audit. No services were started or changed. |
| Published version | `https://todo-virtual-tours.vercel.app/virtual-tours/` responded **200**. The HTML of all 5 pages plus `site.css` and `tour-theatre.js` are **byte-identical** (MD5) to local, so the findings apply to both **[M]**. |
| Tooling | Headless Chrome via the DevTools protocol (a Node script, no installs). Production view (`?review=0`). |
| Measured | All 5 pages × 1440, 1024, 768, 390 and 360 px (25 combinations): page height, section heights, section tone, heading size/width, words per screen, CTA counts, line lengths, font combinations, text under 12 px, small touch targets, horizontal overflow, console errors and failed network requests **[M]**. |
| Visually inspected now | Full-page chunked screenshots of all 5 pages at **1440 px**. |
| Visually inspected earlier this session (same code) | Hero at 1440, 1024 and 390 px; the showcase and live viewer at 1440 and 390 px; the mobile menu, mobile footer and Start page at 390 px. Treat these as recent, not re-captured. |
| Not visually inspected in this pass | Full pages at 1024, 768 and 360 px (measured only); form validation states; dock behaviour while scrolling (covered by the existing automated tests, not re-observed); real devices; Facebook/Instagram in-app browsers; screen readers. |
| Blueprint | The `TODO_Growth_Meta_Landing_Pages_Blueprint` PDF was read in an earlier phase. It was not re-read for this audit. |

**Technical results [M]:**
- **Errors and requests:** 0 console errors and 0 failed requests across all 25 page/width combinations.
- **Overflow:** no horizontal overflow anywhere.
- **Touch targets:** one recurring undersized target (the `info@todo.rw` text link, under 40 px tall).
- **Automated tests:** the existing suite (237 tests) was passing at the end of the previous phase. It was not re-run in this audit.

---

## 3. Page-by-page audit

### 3.1 Experience (`/virtual-tours/`): 8 blocks, 8.7 screens at desktop

| # | Section | Tone | Height (1440) | Verdict |
|---|---|---|---|---|
| 1 | Hero, "The Threshold" | dark | 0.92 vh | **Preserve.** Strongest moment: one idea (stepping through a doorway into a space), with readable copy and CTAs. |
| 2 | Real Spaces showcase | dark | 1.50 vh | **Preserve the concept.** Real proof, early. Below the room rail sit about 150 px of empty dark band **[V]**. |
| 3 | Photo vs tour (compare) | paper | 1.08 vh | **Rebuild.** A good idea, but the dark strip sits inside a paper section and the toggle is followed by about 250 px of nothing **[V]**. It also argues what the showcase just proved. |
| 4 | Why it works (route) | paper | 1.09 vh | **Simplify.** Four bordered boxes with "door gaps" that read as broken borders, not doorways **[V]**. Copy overlaps with sections 3 and 7. |
| 5 | Process line | paper | 0.87 vh | **Remove or merge.** The giant "Capture → Create → Publish → Promote" type plus four columns duplicates the Process page. About 300 px of empty space follows it **[V]**. |
| 6 | Directory (industries) | paper | 1.05 vh | **Simplify.** A plain two-column list of links; visually the weakest section. |
| 7 | What you receive | paper | 0.85 vh | **Merge.** A third version of the deliverables. |
| 8 | Footer | dark | 1.24 vh | **Preserve the design, reduce the repetition** (it repeats the hero headline). |

**Narrative problem:** the story peaks at sections 1–2, then spends five paper sections re-arguing it. The visitor has already been shown the proof before being told the theory **[V]**.

### 3.2 Explore (`/explore/`): 5 blocks, 5.6 screens

- **Preserve:** the demo viewer, with its plan, hotspots and rooms-explored counter. It is the most interactive part of the site **[V]**.
- **Weak:** the thin paper page head (274 px) between two dark surfaces looks like a gap, not a header **[M][V]**.
- **Simplify:** the "What you just did" ledger (1.49 vh, 179 words) is a good idea, but as six bordered rows it reads like a specification table. It is also deliverables copy number two **[V]**.
- **Duplicate:** the Real Spaces showcase is identical to Experience. On Explore it should be framed as "now the real thing", or the duplication removed **[V]**.

### 3.3 Industries (`/industries/`): one 6,423 px block (7.1 screens desktop, 9.2 at 390 px)

- **Preserve:** the seven line drawings (an original asset family), the sticky index, the industry-specific CTAs, and the copy, which is honest and specific.
- **Problem:** all seven sectors use the same structure: number, H2, a quote with a coral rule, body, a "Why it matters" box, "What a tour shows" list, then a yellow CTA plus a drawing **[V]**. Alternating left/right and one night section do not break the monotony. Each sector is about 0.9–1.3 screens.
- **Density:** 810 words in one block; 10 primary CTAs on one page **[M]**.

### 3.4 Process (`/process/`): 6 blocks, 6.7 screens

- **Preserve:** the "Your part / Our part" split. It is the most useful content in the site.
- **Problem:** the stage H2s are 111 px ("Capture", "Publish"), larger than the page H1. Each stage is a giant word, a bordered two-cell table and black mono tags **[V][M]**. The tags repeat the deliverables plate further down the page **[V]**.
- **Simplify:** pick either the overview strip or the side progress track, not both. Each currently duplicates the stage names.

### 3.5 Start (`/start/`): 2 blocks, 2.7 screens

- **Preserve:** the field set, validation, honest submission states, project sheet and progress bar.
- **Problem:** the form panel uses the paper "hard offset shadow" style (8 px black shadow) **[V]**, while the nav and footer are dark and flat. It belongs to the earlier system.
- **Problem:** the footer's large statement and its second primary CTA follow the form immediately **[V]**. On a conversion page the footer should get quieter, not louder.

---

## 4. Cross-site consistency audit

| Element | Inconsistency | Evidence |
|---|---|---|
| Base material | Dark (nav, hero, showcase, viewer, footer) vs paper (all content between them) | **[V]** every page |
| Primary button | Three styles: flat yellow (nav, footer, dark areas); yellow with a 3 px black offset shadow (paper sections); and the "Explore this space" ink bar | **[V]** Experience, Industries, Start |
| Secondary actions | Outlined ghost buttons, underlined link-arrows, and black mono "tags" that look clickable but aren't (Process) | **[V]** |
| Accents | Violet `#6544b0` on paper vs lilac `#c8a8e9` on dark; coral quote rules (Industries only); teal check dots (compare only) | **[V]** |
| Headings | H1 sizes of 74, 78, 93 and 72 px across pages; the 111 px Process stage H2s outrank H1s | **[M]** |
| Notation | At least eight numbering systems; rulers 01–06 on Experience restart on each page | **[V]** |
| Repeated content | Deliverables ×4, process steps ×4, headline ×2 per page, showcase ×2 | **[V]** |

**What survives from the homepage to the form:** the navigation, the footer, the fonts and the yellow CTA. The *concept* (stepping into space) does not survive. It is strong in the hero and showcase, absent from Industries, Process and Start, and only reappears in the Explore demo.

**Signature candidate:** the doorway/aperture opening is already the most memorable element: the hero doors, the showcase room transition and the tour viewer. Combined with a *paper plate laid on a dark scene* (the showcase info panel, hero field), it is distinctive and ownable. The rulers, rows of numbers and dashed dimension lines are the parts to retire or reduce.

---

## 5. Content density and section rhythm

Measured at 1440 px **[M]**. "Words/screen" means words per viewport height.

| Page | Screens (1440 / 390 / 360) | Pattern | Problem |
|---|---|---|---|
| Experience | 8.7 / 11.4 / 13.1 | dark, dark, then paper ×5, then dark | Long middle on one tone and one template; 54–137 words/screen with empty bands |
| Explore | 5.6 / 7.4 / 8.4 | paper (thin), dark, paper, dark, dark | Too many tone flips; the thin head is the weakest moment |
| Industries | 9.1 / 11.3 / 13.2 | paper, then paper (7 sectors), then dark | Monotone, long, 10 CTAs |
| Process | 6.7 / 8.2 / 9.7 | paper throughout | Readable, but oversized stage words and redundant overview/track/tags |
| Start | 2.7 / 3.8 / 4.4 | paper form, then a loud dark footer | The footer competes with the form |

**Targets for implementation [H]:**
- Experience at or under 6 screens at desktop and 8 at 390 px.
- Industries at or under 6 screens at desktop.
- No empty band over 160 px that isn't a deliberate pause.
- No more than two tone changes per page outside the footer.

---

## 6. Prioritised issue list

Each issue lists what is wrong and where, what should change, and how to verify it.

### Critical
- **C1 · Two systems.** The dark/immersive and paper/drawing systems alternate, mostly on Experience, Industries, Process and Start.
  - **Change:** choose one base world and make the other an accent component (§7).
  - **Verify:** a tone map per page shows no more than two changes outside the footer, and the primary button has one style sitewide.
- **C2 · Repeated arguments.** Deliverables appear 4×, process steps 4× and the showcase 2× (Experience, Explore, Process).
  - **Change:** give each fact one home: deliverables on Process, the process summary once on Experience, and the showcase on Experience with a "real rooms" coda on Explore.
  - **Verify:** a content inventory shows each list appears once in full, with at most one short summary elsewhere.
- **C3 · The Experience middle.** Five paper sections repeat one template.
  - **Change:** reduce them to 2–3 sections with distinct compositions: the compare as a full-bleed interactive moment, one benefits statement, then one industries and process bridge.
  - **Verify:** 6 or fewer screens at 1440 px, and no two adjacent sections share the same layout.

### High
- **H1 · Notation overload.** 85 mono nodes and 46 text nodes under 12 px on Experience.
  - **Change:** keep one numbering system (rooms and stages); remove section rulers or use them only between chapters; set mono labels at 12 px minimum.
  - **Verify:** under 30 mono nodes per page and 0 text under 12 px.
- **H2 · Industries monotony.**
  - **Change:** use a selector-and-stage pattern (one sector visible at a time), or group the sectors into three families with different compositions; keep the drawings and copy.
  - **Verify:** 6 or fewer screens, at most 3 primary CTAs visible per screen.
- **H3 · The Start footer competes with the form.**
  - **Change:** a compact footer variant on Start (links, contact and legal only).
  - **Verify:** 0 additional primary CTAs below the submit button.
- **H4 · Button inconsistency.**
  - **Change:** one primary style (flat yellow, no offset shadow), one secondary, one text link.
  - **Verify:** a style audit counts 3 button variants or fewer.
- **H5 · Heading scale.** The Process stage H2s (111 px) outrank the H1.
  - **Change:** one modular type scale.
  - **Verify:** every H2 is smaller than the H1 on its page.

### Medium
- **M1** · The Explore page head is a thin paper strip. Fold it into the dark viewer section as a title overlay.
- **M2** · The Experience "route" boxes have door gaps that read as broken borders. Remove the gaps or redesign the section.
- **M3** · Compare section: about 250 px of empty space under the toggle. Tighten it, or make the strip full height.
- **M4** · About 150 px of empty dark band under the showcase room rail.
- **M5** · Process: the overview strip and the sticky track duplicate each other. Keep one.
- **M6** · Accent colour sprawl (coral, teal, violet, lilac, yellow). Limit to lilac (signature) and yellow (action), plus neutrals.

### Low
- **L1** · The `info@todo.rw` touch target is under 40 px tall on all pages **[M]**.
- **L2** · `site.css` has grown by appending overrides: `.hx-plate` and the nav marker are each redefined in three or more places, across 94 `@media` blocks **[M]**. This is a maintenance risk rather than a visual one, but it makes consistent changes harder.
- **L3** · The black mono tags on Process look like buttons but aren't interactive.

---

## 7. Three creative directions

### Option A: "The Walk-through" (dark world, paper plates)

1. **Idea.** The whole site is one continuous tour of a building at dusk. The dark night material is the world. Information arrives on paper *plates* laid onto scenes, as the showcase panel and hero field already do.
2. **Look and feel.** Deep ink backgrounds with real photography and illustrated rooms as the dominant imagery. Sections are framed as "rooms" entered through doorway transitions. Paper appears only as plates, never as page backgrounds. Lilac is light; yellow is action.
3. **The five pages:**
   - **Experience:** hero, real rooms, one full-bleed compare moment, a benefits plate, then the footer.
   - **Explore:** the demo as the main event, with the title on the scene and the ledger as plates.
   - **Industries:** a sector selector over a dark stage that swaps the drawing (lilac line art on ink) and its plate.
   - **Process:** four rooms, one per stage, each with a your-part/our-part plate.
   - **Start:** the form as a single large plate on a calm dark ground.
4. **Preserves:** the Threshold hero, the doors, the Room Sequence, the viewer, the nav, the footer, the drawings (re-inked lilac) and all copy and functions.
5. **Removes or rethinks:** paper section backgrounds, the section rulers, the route boxes, the duplicated process and deliverable lists, and offset-shadow buttons.
6. **Why it isn't generic:** the dark is not "luxury dark mode". It is the inside of a space, and the paper plate is a specific TODO device. It is also the direction the strongest recent work already took.

### Option B: "The Drawing Set" (paper world, dark apertures)

1. **Idea.** The site is an architect's drawing set. Light paper is the world; dark appears only where you look *into* a space (the hero viewer, tour windows, the compare strip).
2. **Look and feel.** Bright, editorial and technical, with generous white space and line drawings as the hero imagery. The navigation and footer become light. Photography only appears inside dark apertures.
3. **The five pages:** Experience opens on a plan drawing that "opens" into the room. Industries becomes a set of numbered sheets. Process is a construction sequence. Start is a title-block form.
4. **Preserves:** the drawings, the plan, the sheet and the form style.
5. **Removes or rethinks:** the dark nav, dark footer and dark hero field (recent work largely reverted).
6. **Why it isn't generic:** it is rare and memorable. The risk is that it reads as an architecture firm rather than an immersive-experience seller, and it undoes the work the owner most recently approved.

### Option C: "Proof First" (editorial photography)

1. **Idea.** Lead with the real rooms as large editorial photography, magazine-style. The product sells itself through imagery; the illustrated demo becomes a secondary "try the controls" tool on Explore.
2. **Look and feel.** Full-bleed Grotta photography, large serif-free headlines over images, minimal chrome, very few lines or labels.
3. **The five pages:**
   - **Experience:** hero is a real room. Then three more rooms as full-bleed chapters, how it works, and the enquiry.
   - **Industries:** needs one image per sector. Only Grotta imagery exists, so it would be drawings or placeholders.
4. **Preserves:** the showcase, the viewer and the copy.
5. **Removes or rethinks:** the illustrated hero, rulers and most drawings.
6. **Why it isn't generic:** it is strong for hospitality but depends on assets that don't exist for six of the seven industries. It also leans on one client's imagery, which raises the ad-use question flagged earlier.

### Recommendation: Option A, "The Walk-through"

- **It removes the root problem (C1)** by keeping the system that is already strongest and making paper a component instead of a competing world.
- **It fits the product.** Selling "step inside" is best expressed by being inside.
- **It needs no new or unapproved assets.**
- **It preserves the most functionality and recent approvals.**
- **The unique device is the paper plate.** The plate laid on a dark scene keeps it from being a generic dark template.

---

## 8. Proposed design system (for Option A)

- **Typography:**
  - Space Grotesk for everything readable; Space Mono only for room and stage codes and form helper labels, at 12 px minimum.
  - Scale: H1 clamp(2.6–5.4 rem) · H2 clamp(2–3.4 rem) · H3 1.25–1.6 rem · body 17–18 px, 60–72 characters per line · labels 12–13 px.
  - One H1 per page, and every H2 smaller than it.
- **Colour:**
  - Ink `#0b0d17`, raised `#141626`, text `#f5f5f0` / 80% / 62%, paper `#f1ede4` (plates only).
  - Lilac `#c8a8e9` for signature lines and selection; yellow `#e8c547` for primary action only.
  - Retire coral and teal, except for form error and success states.
- **Spacing:** an 8 px base; section padding clamp(80–160 px); a maximum deliberate pause of 160 px; plates get 24–40 px padding.
- **Layout:**
  - A 12-column grid at 1360 px maximum width.
  - Three section archetypes only:
    1. Scene: full-bleed media with a plate.
    2. Statement: one large sentence plus one supporting element.
    3. Selector-and-stage: index plus one big stage.
  - No two adjacent sections may share an archetype.
- **Imagery:** real Grotta photography (portfolio); illustrated rooms and lilac-on-ink line drawings for the demo and industries; never a fictional room presented as real.
- **Motion:** three verbs only:
  - **open** (doors and aperture, about 900 ms, ease-in-out): entering scenes and tours.
  - **settle** (rise, about 700 ms, ease-out): content arriving.
  - **slide** (the nav and selection line, about 500 ms): moving between options.

  Reduced motion means no doors, instant swaps and static content.
- **Section transitions:** an aperture or doorway reveal between chapters, used no more than twice per page. Otherwise a calm cut on the same ink.
- **Responsive:** mobile compositions are designed per archetype. A scene stacks as media then plate; a selector-and-stage becomes a horizontal chip index above the stage. No page over 8 screens at 390 px.

---

## 9. Page-by-page implementation strategy

| Page | Strategy |
|---|---|
| Experience | Keep the hero and showcase. Rebuild the middle as (a) a full-bleed compare scene with a plate, (b) one benefits statement, (c) a bridge combining four-step process chips and an industries teaser, linking out. Remove "What you receive" (it moves to Process). Footer: drop the repeated headline in favour of a distinct closing line. |
| Explore | Put the title onto the dark viewer section. Turn the ledger into plates beside or under the viewer. Present the Real Spaces showcase as "Now step into a real room", the same component under a different heading (or a compact rail linking to Experience). |
| Industries | A selector-and-stage: a sticky sector index plus one stage with a lilac-on-ink drawing and a plate (question, what it shows, why it matters, one CTA). Mobile: a chip index over the stage. |
| Process | Four "rooms" (one scene per stage) with your-part/our-part plates. One deliverables plate (the single home of the list) plus the FAQ. Drop either the overview strip or the side track. |
| Start | The form as one large plate on ink; the project sheet beside it on desktop. Compact footer variant. |
| Shared | One button system, one numbering system, the type scale, and a consolidated `site.css` (remove superseded override layers). |

---

## 10. Must not regress

- All 5 routes and the root redirect (UTMs kept); real links; back/forward.
- Navigation active states, the marker and the mobile menu (focus trap, Escape, focus return).
- UTM and fbclid first-touch attribution, including the blocked-storage link fallback.
- The demo room: drag, keys, quick-turns, hotspots, walking, plan sync and the rooms-explored counter.
- The Room Sequence:
  - the exact 5 Grotta Kuula URLs and embed settings, and SVF gated;
  - one iframe at most, created only when the visitor enters;
  - the dialog viewer (inert background, Escape), Close and All rooms, focus and scroll restoration;
  - full screen, new tab, loading, error, retry and the slow-load link.
- The form:
  - validation, first-invalid-field focus, the optional email policy and duplicate-submit lock;
  - honest not-connected, error, rejected and timeout states;
  - success only on `{ok:true}`; the Lead event ID matches the payload.
- Tracking: no Pixel without an ID and consent; WhatsApp hidden until confirmed; no policy links invented.
- Reduced-motion completeness; no horizontal overflow; no console errors.
- The 237-test suite passes without weakened assertions.

---

## 11. QA checklist for the eventual implementation

- [ ] Tone map per page: no more than 2 tone changes outside the footer (screenshot review at 1440 and 390).
- [ ] Page lengths: Experience ≤ 6 screens (1440) and ≤ 8 (390); Industries ≤ 6 (1440); Process ≤ 6 (1440).
- [ ] No adjacent sections share a layout archetype (manual review per page).
- [ ] Each content list (deliverables, process steps) appears in full exactly once sitewide (content inventory).
- [ ] At most 3 button variants sitewide; one primary style (computed-style audit).
- [ ] 0 text nodes under 12 px; under 30 Space Mono nodes per page (script).
- [ ] Every H2 is smaller than its page's H1 (script).
- [ ] No empty band over 160 px that isn't deliberate (screenshot review).
- [ ] All interactive targets are at least 44 × 44 px, including footer and inline email links (script).
- [ ] Start: no primary CTA below the submit button.
- [ ] 0 console errors and 0 failed requests at 320, 360, 390, 430, 768, 1024, 1440 and 1920 px (script).
- [ ] Reduced motion: no doors, all content visible, instant room swaps (script plus screenshot).
- [ ] Full regression suite passes (237+), with new tests for any new selector-and-stage behaviour.
- [ ] Real-device check on Android and iPhone, including the Facebook and Instagram in-app browsers (manual; not possible in this environment).
