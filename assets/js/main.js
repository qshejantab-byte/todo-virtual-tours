/**
 * Virtual Tours: mounts whatever the current page contains. Shared chrome
 * (nav, menu, attribution, tracking, reveals, dock) lives in site.js.
 */
import { showcaseTours } from "./config.js";
import { $, $$, reduceMotion } from "./site.js";
import { mountDemoRoom, renderStrip, renderWall, planMarkup, SCENES } from "./demo-room.js";

const page = document.body.dataset.page;

/* ── Demo room viewers ─────────────────────────────────────────────────── */
let room = null;
const roomEl = $("[data-room]");
if (roomEl) {
  if (page === "explore") {
    // Exploration feedback: which of the three viewpoints you have seen.
    const visited = new Set();
    const showVisited = () => {
      const n = visited.size;
      const t = $("[data-visited-text]");
      if (t) t.textContent = n === 3 ? "All 3 rooms explored" : `${n} of 3 rooms explored`;
      $$("[data-visited] i").forEach((d, i) => d.classList.toggle("is-on", i < n));
    };
    const vp = new URLSearchParams(location.search).get("vp");
    room = mountDemoRoom(roomEl, {
      scene: SCENES[vp] ? vp : "lobby",
      heading: 0,
      walkable: true,
      onMove(id) {
        // Keep the URL shareable without adding history entries.
        const url = new URL(location.href);
        url.searchParams.set("vp", id);
        history.replaceState(history.state, "", url.pathname + url.search + url.hash);
        $$("[data-vp-no]").forEach((n) => (n.textContent = `VP ${SCENES[id].vp}`));
        visited.add(id);
        showVisited();
      },
    });
    $$("[data-vp-no]").forEach((n) => (n.textContent = `VP ${SCENES[room.scene].vp}`));
    visited.add(room.scene);
    showVisited();
  } else {
    room = mountDemoRoom(roomEl, {
      scene: "suite",
      heading: -24, // open facing the window: the room's clearest view
      walkable: false,
      planLink: (id) => `explore/?vp=${id}`,
    });
  }
}

/* ── Experience: photo vs tour strip ───────────────────────────────────── */
const strip = $("[data-strip]");
if (strip) {
  renderStrip($("[data-strip-track]", strip), "suite");
  const buttons = $$("[data-strip-mode]", strip);
  const setMode = (mode) => {
    strip.dataset.mode = mode;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.stripMode === mode)));
  };
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      strip.dataset.user = "1";
      setMode(b.dataset.stripMode);
    }),
  );
  setMode("photo");
  new IntersectionObserver(
    ([entry], obs) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      setTimeout(() => {
        if (!strip.dataset.user) setMode("tour");
      }, reduceMotion() ? 0 : 1600);
    },
    { threshold: 0.55 },
  ).observe(strip);
}

/* ── Real-spaces gallery (approved tours; pending ones in review only) ── */
const galleryRoot = $("[data-gallery]");
if (galleryRoot) {
  const tours = showcaseTours();
  const startHref = galleryRoot.dataset.startHref || "start/";
  const exploreHref = galleryRoot.dataset.exploreHref || "explore/";
  if (tours.length) {
    import("./tour-theatre.js").then(({ galleryMarkup, mountTheatre }) => {
      galleryRoot.innerHTML = `<div class="theatre" data-theatre>${galleryMarkup(tours, { uid: "g" })}</div>`;
      mountTheatre(galleryRoot.querySelector("[data-theatre]"), tours);
    });
  } else {
    // Public view without approved tours: an honest invitation, clearly
    // illustrated with the original demonstration (never client imagery).
    galleryRoot.innerHTML = `<div class="gal-request" data-proof-on-request>
      <figure class="gal-request-media" data-reveal>
        <div class="doorway-arch night" data-illustration="lobby.entrance"></div>
        <figcaption class="gal-request-tag"><span class="vp" aria-hidden="true"></span>Original demonstration · not a client property</figcaption>
      </figure>
      <div class="gal-request-copy">
        <h3>Real client tours, shared on request.</h3>
        <p>We have produced 360° tours for hospitality and community organisations in Rwanda. Each client decides how their tour is shared, so we send examples directly, matched to the kind of space you have.</p>
        <div class="gal-request-actions">
          <a class="btn btn-ghost on-night btn-lg" href="${startHref}" data-placement="gallery-request">Ask for examples</a>
          <a class="link-arrow" href="${exploreHref}">Try the demonstration <svg class="arr" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>
        </div>
      </div>
    </div>`;
    const lead = document.querySelector("[data-gallery-lead]");
    if (lead) lead.textContent = "Finished client tours are shared directly, with each client's permission. Until then, our demonstration shows how a tour feels.";
    const media = galleryRoot.querySelector(".gal-request-media");
    requestAnimationFrame(() => media.classList.add("is-in"));
  }
}

/* Static walls and plan drawings used as illustrations. */
$$("[data-illustration]").forEach((el) => renderWall(el, el.dataset.illustration, el.dataset.viewbox || "175 160 650 867"));
$$("[data-plan-art]").forEach((el) => (el.innerHTML = planMarkup()));

/* ── Industries: index follows the section in view ─────────────────────── */
const indIndex = $("[data-ind-index]");
if (indIndex) {
  const links = $$("a", indIndex);
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const setCurrent = (id) => {
    links.forEach((a) => a.removeAttribute("aria-current"));
    const a = byId.get(id);
    if (!a) return;
    a.setAttribute("aria-current", "true");
    const list = a.closest("ol");
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: a.offsetLeft - 16, behavior: reduceMotion() ? "auto" : "smooth" });
    }
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
    { rootMargin: "-40% 0px -55% 0px" },
  );
  $$(".ind[id]").forEach((s) => io.observe(s));
}

/* ── Process: the walker follows your progress through the stages ────── */
const proc = $("[data-proc]");
if (proc) {
  const track = $(".proc-track-line", proc);
  const stages = $$(".stage", proc);
  const stops = $$(".proc-stops span", proc);
  const place = () => {
    const r = proc.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.45 - r.top) / (r.height - vh * 0.35)));
    track?.style.setProperty("--p", p.toFixed(3));
    stages.forEach((s, i) => {
      const sr = s.getBoundingClientRect();
      stops[i]?.classList.toggle("is-on", sr.top < vh * 0.55);
    });
  };
  // Stop labels sit where each stage begins, relative to the whole run.
  const layoutStops = () => {
    // Same denominator as place(), so the walker reaches a label as its stage arrives.
    const span = proc.offsetHeight - window.innerHeight * 0.35;
    stages.forEach((s, i) => {
      if (stops[i]) stops[i].style.top = `${Math.min(100, (s.offsetTop / span) * 100)}%`;
    });
  };
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        place();
        ticking = false;
      });
    },
    { passive: true },
  );
  window.addEventListener("resize", () => {
    layoutStops();
    place();
  });
  layoutStops();
  place();
}

/* ── Start: lead form + live project sheet ─────────────────────────────── */
const leadSection = $("[data-lead]");
if (leadSection) {
  import("./lead-form.js").then(({ mountLeadForm }) => {
    const lead = mountLeadForm(leadSection);
    const type = new URLSearchParams(location.search).get("type");
    if (type) lead.prefillType(type);
    import("./project-sheet.js").then(({ mountSheet }) => mountSheet($("[data-sheet]"), $("[data-lead-form]")));
  });
}
