/**
 * The demonstration property: an illustrated, fictional three-viewpoint tour
 * (Lobby, Restaurant, Suite) drawn by TODO Growth. No client content.
 *
 * Each viewpoint is four inward-facing walls of a CSS 3D box: the camera sits
 * in the centre with perspective S/2 (90° horizontal field of view); walls are
 * S wide and 1.5·S tall so the box edges stay out of view. A floor plan stays
 * in sync (view cone = current heading) and doubles as navigation.
 *
 * Headings are plan headings: 0 = north (up on the plan), clockwise.
 * A wall with yaw-heading h is placed at rotateY(-h); `offset` turns the
 * viewer's yaw into the plan heading for that room.
 */
import { ART } from "./room-art.js";

export const SCENES = {
  lobby: {
    name: "Lobby",
    vp: "01",
    offset: 180,
    plan: { x: 215, y: 120 },
    walls: [
      { id: "entrance", h: 0, label: "the entrance", turn: "Entrance", spot: { x: 50, y: 46, kind: "info", title: "Main entrance", text: "Arrival matters. Show visitors exactly where they will walk in." } },
      { id: "restaurant", h: 90, label: "the restaurant", turn: "Restaurant", spot: { x: 50, y: 50, kind: "move", to: "restaurant", title: "Restaurant", text: "Walk through to the restaurant." } },
      { id: "reception", h: 180, label: "reception", turn: "Reception", spot: { x: 50, y: 40, kind: "info", title: "Reception", text: "Hotspots can hold opening hours, check-in times or a contact button." } },
      { id: "rooms", h: 270, label: "the corridor to the rooms", turn: "Rooms", spot: { x: 50, y: 50, kind: "move", to: "suite", title: "Rooms", text: "Head down the corridor to the suite." } },
    ],
  },
  restaurant: {
    name: "Restaurant",
    vp: "02",
    offset: 270,
    plan: { x: 80, y: 120 },
    walls: [
      { id: "windows", h: 0, label: "the window tables", turn: "Windows", spot: { x: 50, y: 44, kind: "info", title: "Window tables", text: "Let diners pick where they would like to sit before they book." } },
      { id: "bar", h: 90, label: "the bar", turn: "Bar", spot: { x: 50, y: 40, kind: "info", title: "Bar", text: "Link the drinks list or menu straight from the scene." } },
      { id: "lobby", h: 180, label: "the way back to the lobby", turn: "Lobby", spot: { x: 50, y: 50, kind: "move", to: "lobby", title: "Lobby", text: "Return to the lobby." } },
      { id: "dining", h: 270, label: "the long table", turn: "Dining", spot: { x: 50, y: 54, kind: "info", title: "Group dining", text: "Show planners how a long table is laid out for groups." } },
    ],
  },
  suite: {
    name: "Suite",
    vp: "03",
    offset: 90,
    plan: { x: 345, y: 120 },
    walls: [
      { id: "view", h: 0, label: "the window view", turn: "View", spot: { x: 62, y: 44, kind: "info", title: "Hillside view", text: "Show guests the view they will wake up to, exactly as it is." } },
      { id: "bed", h: 90, label: "the bed", turn: "Bed", spot: { x: 50, y: 56, kind: "info", title: "King bed", text: "Hotspots can carry room size, bed type or rates." } },
      { id: "door", h: 180, label: "the door to the lobby", turn: "Door", spot: { x: 52, y: 50, kind: "move", to: "lobby", title: "Lobby", text: "Step out to the lobby." } },
      { id: "desk", h: 270, label: "the workspace", turn: "Desk", spot: { x: 34, y: 54, kind: "info", title: "Workspace", text: "Point out what business travellers look for." } },
    ],
  },
};

const CARDINALS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const norm = (a) => ((a % 360) + 360) % 360;
const shortest = (from, to) => from + ((((to - from) % 360) + 540) % 360) - 180;

/* ── Floor plan ─────────────────────────────────────────────────────────── */

const PLAN_SVG = `<svg class="plan-svg" viewBox="0 0 420 240" aria-hidden="true" focusable="false">
<g class="plan-furniture">
  <rect x="26" y="18" width="108" height="11"/>
  <circle cx="38" cy="78" r="9"/><circle cx="38" cy="160" r="9"/>
  <rect x="30" y="204" width="100" height="10"/>
  <rect x="175" y="18" width="80" height="13"/>
  <rect x="186" y="96" width="58" height="48" stroke-dasharray="3 4"/>
  <rect x="300" y="18" width="50" height="10"/>
  <rect x="318" y="172" width="62" height="50"/><path d="M318 184H380"/>
  <circle cx="386" cy="36" r="10"/>
</g>
<g class="plan-walls">
  <path d="M10 10H410M10 230H190M240 230H410M10 10V50M10 110V140M10 200V230M410 10V75M410 165V230"/>
  <path d="M150 10V96M150 150V230M280 10V106M280 142V230"/>
</g>
<g class="plan-windows"><rect x="6" y="50" width="8" height="60"/><rect x="6" y="140" width="8" height="60"/><rect x="406" y="75" width="8" height="90"/></g>
<g class="plan-doors"><path d="M190 230V182A48 48 0 0 1 238 230"/><path d="M280 106H246A34 34 0 0 0 280 140"/><path d="M150 96A54 54 0 0 1 150 150" stroke-dasharray="3 4"/></g>
<g class="plan-labels"><text x="80" y="150">RESTAURANT</text><text x="215" y="150">LOBBY</text><text x="345" y="150">SUITE</text></g>
<path class="plan-cone" d="M0 0L-32 -54A62 62 0 0 1 32 -54Z" transform="translate(215 120) rotate(200)"/>
</svg>`;

function mountPlan(el, { current, moveTo, linkFor }) {
  el.innerHTML = `${PLAN_SVG}<div class="plan-dots"></div>`;
  const dots = el.querySelector(".plan-dots");
  const cone = el.querySelector(".plan-cone");
  dots.innerHTML = Object.entries(SCENES)
    .map(([id, s]) => {
      const pos = `style="left:${(s.plan.x / 420) * 100}%;top:${(s.plan.y / 240) * 100}%"`;
      const inner = `<span class="plan-dot-mark" aria-hidden="true"></span><span class="plan-dot-num" aria-hidden="true">${s.vp}</span>`;
      if (linkFor) {
        return `<a class="plan-dot" data-plan-dot="${id}" href="${linkFor(id)}" ${pos} aria-label="Explore the ${s.name} in the full demonstration">${inner}</a>`;
      }
      return `<button type="button" class="plan-dot" data-plan-dot="${id}" ${pos} aria-label="Walk to the ${s.name}, viewpoint ${s.vp}">${inner}</button>`;
    })
    .join("");
  if (!linkFor) {
    dots.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => moveTo(b.dataset.planDot)));
  }
  const update = (sceneId, heading) => {
    const s = SCENES[sceneId];
    cone.setAttribute("transform", `translate(${s.plan.x} ${s.plan.y}) rotate(${heading})`);
    dots.querySelectorAll("[data-plan-dot]").forEach((d) => {
      const on = d.dataset.planDot === sceneId;
      d.classList.toggle("is-current", on);
      if (on) d.setAttribute("aria-current", "location");
      else d.removeAttribute("aria-current");
      if (on && d.tagName === "A") d.removeAttribute("href");
      else if (!on && d.tagName === "A" && linkFor) d.setAttribute("href", linkFor(d.dataset.planDot));
    });
  };
  update(current, 0);
  return { update };
}

/* ── Viewer ─────────────────────────────────────────────────────────────── */

/**
 * @param {HTMLElement} root  element containing [data-room-viewport] and HUD parts
 * @param {object} opts
 *   scene      initial scene id
 *   heading    initial yaw-heading
 *   walkable   allow moving between viewpoints (move hotspots + plan buttons)
 *   planLink   (id) => href, for a non-walkable plan that links elsewhere
 *   onMove     (sceneId) => void
 */
export function mountDemoRoom(root, opts = {}) {
  const viewport = root.querySelector("[data-room-viewport]");
  const scope = root.closest("[data-room-scope]") || root.parentElement || root;
  const q = (s) => scope.querySelector(s);
  const headingEl = q("[data-room-heading]");
  const cardinalEl = q("[data-room-cardinal]");
  const compassEl = q("[data-room-compass]");
  const liveEl = q("[data-room-live]");
  const nameEls = scope.querySelectorAll("[data-room-name]");
  const turnsEl = q("[data-room-turns]");
  const spotsEl = q("[data-room-spots]");
  const infoEl = q("[data-room-info]");
  const planEl = q("[data-room-plan]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const walkable = Boolean(opts.walkable);

  const cube = document.createElement("div");
  cube.className = "room-cube";
  viewport.appendChild(cube);

  let sceneId = SCENES[opts.scene] ? opts.scene : "suite";
  let scene = SCENES[sceneId];
  let faces = [];
  let turnButtons = [];
  let S = 0;
  let P = 0;
  let yaw = opts.heading ?? 18;
  let pitch = 0;
  let maxPitch = 8;
  let velocity = 0;
  let dragging = false;
  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  let idleUntil = 0;
  let visible = true;
  let raf = 0;
  let tween = null;
  let walking = false;
  let lastFrame = performance.now();

  const plan = planEl
    ? mountPlan(planEl, { current: sceneId, moveTo: (id) => goTo(id), linkFor: walkable ? null : opts.planLink })
    : null;

  function buildScene() {
    cube.innerHTML = scene.walls
      .map((w) => {
        const pin = w.spot;
        const pinHtml =
          pin.kind === "move" && !walkable
            ? ""
            : `<span class="room-pin room-pin--${pin.kind}" data-spot="${w.id}" style="left:${pin.x}%;top:${pin.y}%" aria-hidden="true"><i></i><b>${pin.kind === "move" ? "→ " : ""}${pin.title}</b></span>`;
        return `<div class="room-face" data-wall="${w.id}">${ART[`${sceneId}.${w.id}`]("r" + sceneId + w.id)}${pinHtml}</div>`;
      })
      .join("");
    faces = [...cube.children];
    nameEls.forEach((n) => (n.textContent = scene.name));
    if (turnsEl) {
      turnsEl.innerHTML = scene.walls
        .map((w) => `<button type="button" data-room-turn="${w.id}" aria-pressed="false">${w.turn}</button>`)
        .join("");
      turnButtons = [...turnsEl.querySelectorAll("button")];
      turnButtons.forEach((b) => b.addEventListener("click", () => turnTo(b.dataset.roomTurn)));
    }
    if (spotsEl) {
      spotsEl.innerHTML = scene.walls
        .filter((w) => w.spot.kind === "info" || walkable)
        .map(
          (w) => `<li><button type="button" class="spot-btn spot-btn--${w.spot.kind}" data-spot-btn="${w.id}">
            <span class="spot-btn-kind">${w.spot.kind === "move" ? "Walk to" : "Info"}</span>
            <span class="spot-btn-title">${w.spot.title}</span></button></li>`,
        )
        .join("");
      spotsEl.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => activateSpot(b.dataset.spotBtn)));
    }
    if (infoEl) infoEl.innerHTML = `<p class="room-info-hint">Tap a marker in the scene, or choose one from the list.</p>`;
    layout();
  }

  function layout() {
    const r = viewport.getBoundingClientRect();
    if (!r.width) return;
    S = Math.round(r.width);
    P = S / 2;
    viewport.style.perspective = `${P}px`;
    cube.style.width = `${S}px`;
    cube.style.height = `${S * 1.5}px`;
    faces.forEach((f, i) => {
      f.style.transform = `rotateY(${-scene.walls[i].h}deg) translateZ(${-S / 2 + 0.5}px)`;
    });
    // Corner half-angle is atan(0.75·√2) ≈ 46.7°; keep the box edges out of view.
    const halfV = (Math.atan(r.height / r.width) * 180) / Math.PI;
    maxPitch = Math.max(0, Math.min(10, 46.7 - halfV - 1));
    pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));
    render();
  }

  const planHeading = () => norm(yaw + scene.offset);

  function render() {
    cube.style.transform = `translate(-50%, -50%) translateZ(${P}px) rotateX(${pitch}deg) rotateY(${yaw}deg)`;
    const heading = Math.round(planHeading());
    if (headingEl) headingEl.textContent = String(heading).padStart(3, "0") + "°";
    if (cardinalEl) cardinalEl.textContent = CARDINALS[Math.round(heading / 45) % 8];
    if (compassEl) compassEl.style.setProperty("--yaw", String(planHeading()));
    if (plan) plan.update(sceneId, planHeading());
    const facing = nearestWall();
    turnButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.roomTurn === facing.id)));
  }

  function nearestWall() {
    let best = scene.walls[0];
    let bestD = 999;
    for (const w of scene.walls) {
      const d = Math.abs(shortest(yaw, w.h) - yaw);
      if (d < bestD) {
        bestD = d;
        best = w;
      }
    }
    return best;
  }

  function interacted(ms = 7000) {
    idleUntil = performance.now() + ms;
    root.classList.add("is-touched");
    tween = null;
  }

  function loop(now) {
    const dt = Math.min(64, now - lastFrame);
    lastFrame = now;
    if (tween) {
      const t = Math.min(1, (now - tween.start) / tween.dur);
      const e = 1 - Math.pow(1 - t, 3);
      yaw = tween.from + (tween.to - tween.from) * e;
      pitch = tween.pFrom * (1 - e);
      if (t >= 1) tween = null;
      render();
    } else if (!dragging && Math.abs(velocity) > 0.002 && !reduce.matches) {
      yaw += velocity * dt;
      velocity *= Math.pow(0.92, dt / 16);
      render();
    } else if (!dragging && !reduce.matches && now > idleUntil && !walking) {
      yaw += 0.0055 * dt; // slow ambient drift: ~65 s per revolution, stops on interaction
      render();
    }
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
  }

  function start() {
    if (!raf && visible && !document.hidden) {
      lastFrame = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }

  function announce(t) {
    if (liveEl) liveEl.textContent = t;
  }

  function turnTo(wallId, { quiet = false } = {}) {
    const w = scene.walls.find((x) => x.id === wallId);
    if (!w) return;
    interacted(9000);
    const target = shortest(yaw, w.h);
    if (reduce.matches || document.hidden) {
      yaw = target;
      pitch = 0;
      render();
    } else {
      tween = { from: yaw, to: target, pFrom: pitch, start: performance.now(), dur: 750 };
      start();
    }
    if (!quiet) announce(`Facing ${w.label}.`);
  }

  function showInfo(w) {
    if (!infoEl) return;
    infoEl.innerHTML = `<p class="room-info-kicker">Information hotspot</p><p class="room-info-title">${w.spot.title}</p><p class="room-info-text">${w.spot.text}</p>`;
  }

  function activateSpot(wallId) {
    const w = scene.walls.find((x) => x.id === wallId);
    if (!w) return;
    if (w.spot.kind === "move") {
      if (walkable) goTo(w.spot.to);
      return;
    }
    turnTo(w.id, { quiet: true });
    showInfo(w);
    root.querySelectorAll(".room-pin").forEach((p) => p.classList.toggle("is-open", p.dataset.spot === w.id));
    announce(`${w.spot.title}. ${w.spot.text}`);
  }

  /** Walk to another viewpoint: dolly forward, swap, settle. */
  function goTo(id, { heading } = {}) {
    if (!SCENES[id] || id === sceneId || walking) return;
    const from = sceneId;
    const target = SCENES[id];
    const back = target.walls.find((w) => w.spot.kind === "move" && w.spot.to === from);
    const arrive = heading ?? (back ? norm(back.h + 180) : 0);
    interacted(9000);
    const swap = () => {
      sceneId = id;
      scene = target;
      yaw = arrive;
      pitch = 0;
      buildScene();
      announce(`You are in the ${target.name}, viewpoint ${target.vp}.`);
      opts.onMove?.(id);
    };
    if (reduce.matches || document.hidden) {
      swap();
      return;
    }
    walking = true;
    root.classList.add("is-walking");
    setTimeout(() => {
      swap();
      root.classList.remove("is-walking");
      root.classList.add("is-arriving");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          root.classList.remove("is-arriving");
          setTimeout(() => (walking = false), 420);
        }),
      );
    }, 380);
  }

  // Pointer: horizontal drag turns; mouse can also tilt. touch-action: pan-y
  // keeps vertical page scrolling on phones. A tap on a marker activates it.
  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    velocity = 0;
    interacted();
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    lastT = performance.now();
    viewport.setPointerCapture(e.pointerId);
    root.classList.add("is-dragging");
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const now = performance.now();
    const k = 57.3 / P;
    const dx = e.clientX - lastX;
    yaw -= dx * k;
    if (e.pointerType === "mouse") {
      pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch + (e.clientY - lastY) * k));
    }
    velocity = (-dx * k) / Math.max(1, now - lastT);
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
    render();
  });
  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-dragging");
    if (performance.now() - lastT > 80) velocity = 0;
    if (e && e.type === "pointerup" && Math.hypot(e.clientX - downX, e.clientY - downY) < 6) {
      // A tap: hit-test the markers (pointer capture retargets the event).
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el.closest?.(".room-pin"));
      const pin = hit && hit.closest(".room-pin");
      if (pin) activateSpot(pin.dataset.spot);
    }
    interacted();
    start();
  };
  viewport.addEventListener("pointerup", end);
  viewport.addEventListener("pointercancel", end);
  viewport.addEventListener("lostpointercapture", () => end());

  viewport.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 45 : 15;
    let handled = true;
    if (e.key === "ArrowLeft") yaw -= step;
    else if (e.key === "ArrowRight") yaw += step;
    else if (e.key === "ArrowUp") pitch = Math.max(-maxPitch, pitch - 4);
    else if (e.key === "ArrowDown") pitch = Math.min(maxPitch, pitch + 4);
    else if (e.key === "Home") {
      e.preventDefault();
      return turnTo(scene.walls[0].id);
    } else handled = false;
    if (handled) {
      e.preventDefault();
      interacted();
      tween = null;
      render();
      announce(`Facing ${nearestWall().label}, heading ${Math.round(planHeading())} degrees.`);
    }
  });

  new ResizeObserver(layout).observe(viewport);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(viewport);
  document.addEventListener("visibilitychange", start);
  reduce.addEventListener?.("change", render);

  buildScene();
  start();

  return {
    turnTo,
    goTo,
    activateSpot,
    get scene() {
      return sceneId;
    },
    focus() {
      viewport.focus({ preventScroll: true });
    },
    /** Short guided look-around used by "View Example". */
    showcase() {
      if (reduce.matches) return turnTo(scene.walls[1].id);
      interacted(9000);
      tween = { from: yaw, to: yaw + 120, pFrom: pitch, start: performance.now(), dur: 1600 };
      start();
    },
  };
}

/** The plan drawing alone (decorative use). */
export const planMarkup = () => PLAN_SVG;

/** One wall as a static, cropped illustration (e.g. inside an arch). */
export function renderWall(el, key, viewBox) {
  el.innerHTML = ART[key]("w" + key.replace(".", ""))
    .replace('viewBox="0 -250 1000 1500"', `viewBox="${viewBox}"`)
    .replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMid slice"');
}

/** Static panorama strip of one scene, laid flat (used for "photo vs tour"). */
export function renderStrip(el, sceneId = "suite") {
  const scene = SCENES[sceneId];
  el.innerHTML = scene.walls
    .map((w) => {
      const svg = ART[`${sceneId}.${w.id}`]("s" + sceneId + w.id).replace('viewBox="0 -250 1000 1500"', 'viewBox="0 120 1000 700"');
      return `<div class="strip-wall" data-wall="${w.id}">${svg}</div>`;
    })
    .join("");
}
