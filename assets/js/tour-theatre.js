/**
 * The Room Sequence: TODO Growth's real portfolio rooms, one at a time.
 *
 * One cinematic stage shows one real room. A paper title block names it and
 * invites the visitor in; changing rooms opens the next photograph like a
 * pair of doors parting (the same gesture that opens the hero).
 *
 * Loading: a cross-origin iframe cannot report whether Kuula rendered, so a
 * lightweight reachability probe decides whether kuula.co can be reached at
 * all. Kuula's page can take 20 s+ to fire `load` on a cold, slow connection,
 * so once Kuula is reachable the viewer is revealed on `load` or after
 * REVEAL_AFTER, whichever comes first (Kuula shows its own progress), with
 * direct links on hand. After SLOW_AFTER the loader offers the direct link.
 * A failed probe, going offline, or no sign of Kuula in READY_TIMEOUT → error.
 *
 * Only one iframe ever exists; it is created when the visitor enters a room
 * and destroyed when they leave or switch.
 */
import { trackViewContent } from "./tracking.js";

const READY_TIMEOUT = 20000;
const SLOW_AFTER = 6000;
const REVEAL_AFTER = 2500;
const SETTLE_DELAY = 450;
const DOORS = 900;
const REACHABILITY_URL = "https://kuula.co/favicon.ico";
// Resolved from this module, so it works from any page depth.
const IMG_ROOT = new URL("../img/", import.meta.url).href;
const img = (t, w) => `${IMG_ROOT}${t.posterDir || "pending"}/${t.poster}-${w}.webp`;
const ext = `<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M7 4h9v9M16 4L5 15" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`;
const pad = (n) => String(n).padStart(2, "0");

function posterSet(tour) {
  const max = tour.posterMaxWidth || 1280;
  const sizes = [640, 1280].filter((w) => w <= max);
  return { src: img(tour, sizes[sizes.length - 1]), srcset: sizes.map((w) => `${img(tour, w)} ${w}w`).join(", ") };
}

/** Markup. `uid` keeps ids unique if two sequences share a page. */
export function galleryMarkup(tours, { uid = "g" } = {}) {
  const tabs = tours
    .map(
      (t, i) => `<button type="button" role="tab" class="theatre-tab" id="${uid}-tab-${t.id}" data-tour="${t.id}"
        aria-controls="${uid}-stage" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
        <span class="theatre-tab-bar" aria-hidden="true"></span>
        <img src="${img(t, 200)}" alt="" width="200" height="133" loading="lazy" decoding="async">
        <span class="theatre-tab-num" aria-hidden="true">${pad(i + 1)}</span>
        <span class="theatre-tab-text"><span class="theatre-tab-title">${t.title}</span><span class="theatre-tab-client">${t.facts ? t.facts.view : t.client}</span></span>
        ${t.permission === "pending" ? '<span class="theatre-tab-flag">Pending permission</span>' : ""}
      </button>`,
    )
    .join("");
  return `
  <div class="seq">
    <div class="seq-frame">
      <div class="theatre-stage" id="${uid}-stage" role="tabpanel" data-theatre-stage data-state="preview">
        <div class="theatre-frame" data-theatre-frame></div>
        <img class="theatre-poster" data-theatre-poster alt="" decoding="async" sizes="100vw" width="1280" height="853" />
        <img class="seq-doors" data-seq-doors alt="" aria-hidden="true" decoding="async" sizes="100vw" />
        <div class="theatre-scrim" aria-hidden="true"></div>
        <span class="theatre-pending">Pending client permission · review only</span>
        <p class="seq-tag" aria-hidden="true"><i></i>Real 360° tour</p>
        <button type="button" class="gal-step gal-step--prev" data-theatre-prev aria-label="Previous room"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
        <button type="button" class="gal-step gal-step--next" data-theatre-next aria-label="Next room"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M8 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>

        <div class="theatre-loading">
          <svg class="aperture" viewBox="0 0 80 80" width="72" height="72" aria-hidden="true"><circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="2"/><circle class="aperture-arc" cx="40" cy="40" r="34" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="60 154" stroke-linecap="round"/><circle cx="40" cy="40" r="3" fill="currentColor"/></svg>
          <p class="kicker">Stepping inside</p>
          <p class="theatre-loading-name" data-theatre-field="title"></p>
          <a class="theatre-slow" data-theatre-direct href="#" target="_blank" rel="noopener noreferrer">Taking a while? Open the tour in a new tab ↗</a>
        </div>
        <div class="theatre-error">
          <p class="theatre-error-title">This tour couldn't open here.</p>
          <p>Your connection or this app's browser may be blocking it. Try again, or open the tour in a new tab.</p>
          <div class="theatre-error-actions">
            <button type="button" class="btn btn-primary" data-theatre-retry>Try again</button>
            <a class="btn btn-ghost on-night" data-theatre-direct href="#" target="_blank" rel="noopener noreferrer">Open tour in a new tab ↗</a>
          </div>
        </div>
        <div class="theatre-bar">
          <button type="button" class="theatre-bar-btn" data-theatre-close><svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" stroke-width="2"/></svg>Close tour</button>
          <button type="button" class="theatre-bar-btn" data-theatre-rooms><span class="hide-xs">All </span>rooms</button>
          <span class="theatre-bar-room"><span class="vp-code" data-theatre-field="code"></span><span data-theatre-field="title"></span></span>
          <span class="theatre-bar-note">Still loading…</span>
          <span class="theatre-bar-end">
            <button type="button" class="theatre-bar-btn" data-theatre-fullscreen hidden>Full screen</button>
            <a class="theatre-bar-btn" data-theatre-direct href="#" target="_blank" rel="noopener noreferrer">New tab ${ext}</a>
          </span>
        </div>
        <p class="sr-only" role="status" aria-live="polite" data-theatre-announce></p>
      </div>

      <div class="seq-plate">
        <p class="seq-no"><span data-theatre-field="num"></span><span class="seq-of" data-theatre-field="count"></span></p>
        <p class="gal-client" data-theatre-field="client"></p>
        <h3 class="gal-title" data-theatre-field="title"></h3>
        <p class="gal-desc" data-theatre-field="description"></p>
        <dl class="gal-facts" data-theatre-field="facts"></dl>
        <button type="button" class="seq-enter" data-theatre-begin>
          <span class="seq-enter-eye" aria-hidden="true"></span>
          <span>Explore this space</span>
          <svg class="arr" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
    </div>

    <div class="theatre-index">
      <p class="index-label" id="${uid}-list-label">Choose a room</p>
      <div class="theatre-list" role="tablist" aria-labelledby="${uid}-list-label" data-theatre-list>${tabs}</div>
    </div>
  </div>`;
}

export function mountTheatre(root, tours) {
  const list = root.querySelector("[data-theatre-list]");
  const stage = root.querySelector("[data-theatre-stage]");
  const frame = stage.querySelector("[data-theatre-frame]");
  const poster = stage.querySelector("[data-theatre-poster]");
  const doors = stage.querySelector("[data-seq-doors]");
  const beginBtn = root.querySelector("[data-theatre-begin]");
  const closeBtn = stage.querySelector("[data-theatre-close]");
  const retryBtn = stage.querySelector("[data-theatre-retry]");
  const fsBtn = stage.querySelector("[data-theatre-fullscreen]");
  const directLinks = [...stage.querySelectorAll("[data-theatre-direct]")];
  const announce = stage.querySelector("[data-theatre-announce]");
  const field = (n) => root.querySelectorAll(`[data-theatre-field="${n}"]`);
  const tabs = [...list.querySelectorAll("[role=tab]")];
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 767.98px)");
  const canFullscreen = Boolean(stage.requestFullscreen || stage.webkitRequestFullscreen);

  let current = null;
  let iframe = null;
  let attempt = 0;
  let timers = [];
  let probe = null;
  let doorTimer = 0;

  // While a tour is open, everything outside it is inert (a modal dialog).
  let inerted = [];
  const setBackgroundInert = (on) => {
    inerted.forEach((el) => el.removeAttribute("inert"));
    inerted = [];
    if (!on) return;
    for (let node = stage; node && node !== document.body; node = node.parentElement) {
      for (const sib of node.parentElement ? node.parentElement.children : []) {
        if (sib !== node && !sib.hasAttribute("inert") && sib.tagName !== "SCRIPT") {
          sib.setAttribute("inert", "");
          inerted.push(sib);
        }
      }
    }
  };

  const setState = (s) => {
    const wasImmersive = stage.classList.contains("is-immersive");
    stage.dataset.state = s;
    root.dataset.state = s;
    root.classList.toggle("is-live", s === "live");
    // Entering a tour moves from the exhibition into a dedicated dark
    // viewing state, on every screen size, with a clear way back.
    const immersive = s === "live" || s === "loading";
    stage.classList.toggle("is-immersive", immersive);
    document.documentElement.classList.toggle("tour-open", immersive);
    if (immersive !== wasImmersive) {
      setBackgroundInert(immersive);
      if (immersive) {
        stage.setAttribute("role", "dialog");
        stage.setAttribute("aria-modal", "true");
        stage.setAttribute("aria-label", `${current.title}: real 360° tour`);
      } else {
        stage.setAttribute("role", "tabpanel");
        stage.removeAttribute("aria-modal");
        stage.removeAttribute("aria-label");
        root.classList.remove("is-returning");
        void root.offsetWidth;
        root.classList.add("is-returning");
      }
    }
    if (fsBtn) fsBtn.hidden = !(canFullscreen && s === "live" && !compact.matches);
  };
  const say = (t) => {
    announce.textContent = t;
  };

  function onOffline() {
    fail(attempt);
  }

  function endAttempt() {
    attempt++;
    timers.forEach(clearTimeout);
    timers = [];
    if (probe) {
      probe.abort();
      probe = null;
    }
    window.removeEventListener("offline", onOffline);
    if (iframe) {
      iframe.src = "about:blank";
      iframe.remove();
      iframe = null;
    }
    stage.classList.remove("is-frame-pending", "is-slow");
  }

  function paintText(tour) {
    const i = tours.indexOf(tour);
    field("title").forEach((n) => (n.textContent = tour.title));
    field("client").forEach((n) => (n.textContent = `${tour.client} · ${tour.place}`));
    field("description").forEach((n) => (n.textContent = tour.description || ""));
    field("num").forEach((n) => (n.textContent = pad(i + 1)));
    field("code").forEach((n) => (n.textContent = `Room ${pad(i + 1)}`));
    field("count").forEach((n) => (n.textContent = ` / ${pad(tours.length)}`));
    field("facts").forEach((n) => {
      const f = tour.facts;
      n.innerHTML = f ? `<div><dt>Size</dt><dd>${f.size}</dd></div><div><dt>Sleeps</dt><dd>${f.guests}</dd></div><div><dt>Outlook</dt><dd>${f.view}</dd></div>` : "";
      n.hidden = !f;
    });
    stage.classList.toggle("is-pending", tour.permission === "pending");
    directLinks.forEach((a) => {
      a.href = tour.kuula;
      a.setAttribute("aria-label", `Open the ${tour.title} tour in a new tab`);
    });
    beginBtn.setAttribute("aria-label", `Explore this space: ${tour.title}, real 360° tour`);
  }

  function paintPoster(tour) {
    const ps = posterSet(tour);
    poster.srcset = ps.srcset;
    poster.src = ps.src;
    poster.alt = `${tour.title}: preview of the real 360° tour`;
  }

  /** Doors: the next room's photograph parts open from the centre. */
  function openDoors(tour) {
    clearTimeout(doorTimer);
    const ps = posterSet(tour);
    doors.classList.remove("is-open");
    doors.srcset = ps.srcset;
    doors.src = ps.src;
    const go = () => {
      void doors.offsetWidth;
      doors.classList.add("is-open");
      doorTimer = setTimeout(() => {
        paintPoster(tour);
        doors.classList.add("is-settled");
        requestAnimationFrame(() => {
          doors.classList.remove("is-open", "is-settled");
        });
      }, DOORS);
    };
    if (doors.complete && doors.naturalWidth) go();
    else {
      doors.addEventListener("load", go, { once: true });
      doors.addEventListener("error", () => paintPoster(tour), { once: true });
    }
  }

  function select(tour, { focusTab = false } = {}) {
    const wasActive = stage.dataset.state === "live" || stage.dataset.state === "loading";
    if (tour === current && !wasActive) return;
    const first = current === null;
    current = tour;
    tabs.forEach((tab) => {
      const on = tab.dataset.tour === tour.id;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focusTab) tab.focus();
    });
    stage.setAttribute("aria-labelledby", tabs.find((t) => t.dataset.tour === tour.id).id);
    paintText(tour);
    root.classList.remove("is-turning");
    void root.offsetWidth;
    root.classList.add("is-turning");

    // Choosing another room always returns to the exhibition first: the old
    // tour is disposed of, and the visitor enters the new one deliberately.
    endAttempt();
    setState("preview");
    if (wasActive) {
      paintPoster(tour);
      return;
    }
    if (first || reduce()) paintPoster(tour);
    else openDoors(tour);
  }

  function begin() {
    if (!current) return;
    endAttempt();
    const token = attempt;
    setState("loading");
    say(`Opening the ${current.title} tour.`);
    trackViewContent(current.id);

    if (navigator.onLine === false) return fail(token);
    window.addEventListener("offline", onOffline);

    let frameLoaded = false;
    let reachable = false;
    let revealed = false;
    stage.classList.add("is-frame-pending");

    const reveal = () => {
      if (token !== attempt || revealed) return;
      revealed = true;
      timers.push(
        setTimeout(() => {
          if (token !== attempt) return;
          setState("live");
          say(`The ${current.title} tour is open. Drag to look around. Use Close tour to return to the rooms.`);
          closeBtn.focus({ preventScroll: true });
        }, SETTLE_DELAY),
      );
    };

    iframe = document.createElement("iframe");
    iframe.title = `360° virtual tour of the ${current.title}, ${current.client}: drag to look around and move between viewpoints`;
    iframe.allow = "fullscreen; gyroscope; accelerometer; xr-spatial-tracking";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.addEventListener("load", () => {
      if (!iframe || iframe.src === "about:blank" || token !== attempt) return;
      frameLoaded = true; // a loaded Kuula document also proves reachability
      stage.classList.remove("is-frame-pending");
      reveal();
    });
    iframe.src = current.kuula;
    frame.appendChild(iframe);

    probe = new AbortController();
    fetch(`${REACHABILITY_URL}?t=${Date.now()}`, { mode: "no-cors", cache: "no-store", signal: probe.signal })
      .then(() => {
        if (token !== attempt) return;
        reachable = true;
        if (frameLoaded) reveal();
        else timers.push(setTimeout(reveal, REVEAL_AFTER));
      })
      .catch(() => {
        if (token === attempt) fail(token);
      });

    timers.push(
      setTimeout(() => {
        if (token === attempt && stage.dataset.state === "loading") stage.classList.add("is-slow");
      }, SLOW_AFTER),
      setTimeout(() => {
        if (token === attempt && !reachable && !frameLoaded) fail(token);
      }, READY_TIMEOUT),
    );
  }

  function fail(token) {
    if (token !== attempt) return;
    endAttempt();
    setState("error");
    say(`The ${current.title} tour could not be opened. You can try again or open it in a new tab.`);
    retryBtn.focus({ preventScroll: true });
  }

  function exitFullscreen() {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsEl === stage) (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
  }

  function close({ toRooms = false } = {}) {
    exitFullscreen();
    endAttempt();
    setState("preview");
    say(toRooms ? "Tour closed. Choose a room." : `Tour closed. Back at the ${current.title}.`);
    // Back to where the visitor left: the same room, the same control.
    const target = toRooms ? tabs.find((t) => t.getAttribute("aria-selected") === "true") : beginBtn;
    target.focus({ preventScroll: true });
  }

  const step = (d) => select(tours[(tours.indexOf(current) + d + tours.length) % tours.length]);

  tabs.forEach((tab) => tab.addEventListener("click", () => select(tours.find((t) => t.id === tab.dataset.tour))));
  list.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % tabs.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    select(tours[n], { focusTab: true });
  });

  beginBtn.addEventListener("click", begin);
  retryBtn.addEventListener("click", begin);
  closeBtn.addEventListener("click", () => close());
  stage.querySelector("[data-theatre-rooms]").addEventListener("click", () => close({ toRooms: true }));
  stage.querySelector("[data-theatre-prev]").addEventListener("click", () => step(-1));
  stage.querySelector("[data-theatre-next]").addEventListener("click", () => step(1));
  fsBtn?.addEventListener("click", () => {
    const req = stage.requestFullscreen || stage.webkitRequestFullscreen;
    req?.call(stage).catch?.(() => {});
  });
  root.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (stage.dataset.state === "live" || stage.dataset.state === "loading")) close();
  });
  // Swipe between rooms on the preview (touch only; never while a tour is live).
  let sx = null;
  let sy = null;
  stage.addEventListener(
    "touchstart",
    (e) => {
      if (stage.dataset.state !== "preview") return;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    },
    { passive: true },
  );
  stage.addEventListener(
    "touchend",
    (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      sx = null;
      // Clearly horizontal swipes only, so scrolling never changes the room.
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );
  compact.addEventListener?.("change", () => setState(stage.dataset.state));

  select(tours[0]);

  return {
    open() {
      if (stage.dataset.state === "preview" || stage.dataset.state === "error") begin();
    },
    focusBegin() {
      beginBtn.focus({ preventScroll: true });
    },
  };
}
