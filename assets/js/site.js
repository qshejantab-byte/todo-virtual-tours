/**
 * Shared site chrome for every Virtual Tours page: navigation, mobile menu,
 * review bar, contact gating, reveals, sticky CTA dock and attribution carry.
 */
import { CONFIG, REVIEW_MODE, whatsappHref } from "./config.js";
import { captureAttribution, attributionStorageOK, attributionQuery } from "./attribution.js";
import { initTracking } from "./tracking.js";

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Attribution + tracking (every page) ────────────────────────────────── */
captureAttribution();
initTracking();

// If storage is blocked (some in-app browsers), carry campaign parameters on
// internal links so they still reach the enquiry page.
if (!attributionStorageOK()) {
  const qs = attributionQuery();
  if (qs) {
    $$("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      new URLSearchParams(qs).forEach((v, k) => {
        if (!url.searchParams.has(k)) url.searchParams.set(k, v);
      });
      a.setAttribute("href", url.pathname + url.search + url.hash);
    });
  }
}

/* ── Review bar ─────────────────────────────────────────────────────────── */
if (REVIEW_MODE) {
  const pending = [];
  const pendingTours = CONFIG.tours.filter((t) => t.permission !== "approved").length;
  if (pendingTours) pending.push(`${pendingTours} client tour (SVF) awaiting written permission, not shown publicly`);
  if (!whatsappHref()) pending.push("WhatsApp number unconfirmed (hidden)");
  if (!CONFIG.submission.endpoint) pending.push("form backend not connected");
  if (!CONFIG.tracking.metaPixelId) pending.push("Meta Pixel ID and consent approach not set");
  const bar = $("[data-review-bar]");
  if (bar) {
    const url = new URL(location.href);
    url.searchParams.set("review", "0");
    $("[data-review-list]", bar).textContent = pending.join(" · ");
    $("[data-review-prod]", bar).href = url.pathname + url.search + url.hash;
    bar.hidden = false;
  }
}

/* ── Contact channels ──────────────────────────────────────────────────── */
const wa = whatsappHref();
$$("[data-wa]").forEach((el) => {
  if (wa) {
    el.href = wa;
    el.hidden = false;
  } else {
    el.remove();
  }
});
$$("[data-email]").forEach((el) => {
  el.href = `mailto:${CONFIG.contact.email}`;
  if (!el.dataset.keepText) el.textContent = CONFIG.contact.email;
});
$$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

/* ── Header: hairline once scrolled ────────────────────────────────────── */
const head = $("[data-head]");
if (head) {
  const onScroll = () => head.classList.toggle("is-stuck", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── Desktop nav: the viewpoint marker ─────────────────────────────────── */
const nav = $("[data-nav]");
if (nav) {
  const marker = $("[data-nav-marker]", nav);
  const links = $$("a", nav);
  const current = links.find((a) => a.getAttribute("aria-current") === "page");
  const place = (a) => {
    if (!a) {
      marker.style.opacity = "0";
      return;
    }
    const nr = nav.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    marker.style.opacity = "1";
    // A floor line under the whole room, with the viewpoint standing at its centre.
    marker.style.width = `${r.width}px`;
    marker.style.transform = `translateX(${r.left - nr.left}px)`;
  };
  links.forEach((a) => {
    a.addEventListener("pointerenter", () => place(a));
    a.addEventListener("focus", () => place(a));
  });
  nav.addEventListener("pointerleave", () => place(current));
  nav.addEventListener("focusout", (e) => {
    if (!nav.contains(e.relatedTarget)) place(current);
  });
  const settle = () => {
    marker.style.transition = "none";
    place(current);
    requestAnimationFrame(() => (marker.style.transition = ""));
  };
  settle();
  window.addEventListener("resize", settle);
  document.fonts?.ready.then(settle);
}

/* ── Mobile menu: dialog with focus trap, Escape, focus return ─────────── */
const menu = $("[data-menu]");
const openBtn = $("[data-menu-open]");
if (menu && openBtn) {
  const closeBtn = $("[data-menu-close]", menu);
  const page = [$("main"), $(".site-foot"), $("[data-head]"), $("[data-dock]")].filter(Boolean);
  const focusables = () => $$("a[href], button:not([disabled])", menu).filter((el) => !el.hidden);
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    menu.classList.add("is-open");
    openBtn.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
    page.forEach((el) => el.setAttribute("inert", ""));
    requestAnimationFrame(() => closeBtn.focus());
  };
  const close = ({ restore = true } = {}) => {
    menu.classList.remove("is-open");
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    page.forEach((el) => el.removeAttribute("inert"));
    if (restore) (lastFocus && lastFocus.isConnected ? lastFocus : openBtn).focus();
  };
  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", () => close());
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const f = focusables();
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  // Same-page links (current page) just close the menu.
  $$("a", menu).forEach((a) =>
    a.addEventListener("click", () => {
      if (a.getAttribute("aria-current") === "page") close({ restore: false });
    }),
  );
  window.matchMedia("(min-width: 1100px)").addEventListener?.("change", (m) => {
    if (m.matches && menu.classList.contains("is-open")) close({ restore: false });
  });
}

/* ── Reveals: fade/rise, self-drawing plans ────────────────────────────── */
$$("[data-draw] .ln, [data-draw] .wall, [data-draw] .soft").forEach((el) => el.setAttribute("pathLength", "1"));
const revealables = $$("[data-reveal], [data-draw], [data-route]");
if ("IntersectionObserver" in window && !reduceMotion()) {
  document.documentElement.classList.add("reveal-ready");
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("is-in"));
}

/* ── Sticky CTA dock (phones/tablets) ──────────────────────────────────── */
const dock = $("[data-dock]");
if (dock) {
  const firstScreen = $("main > section");
  const final = $(".site-foot");
  let pastFirst = false;
  let atFinal = false;
  const sync = () => dock.classList.toggle("is-shown", pastFirst && !atFinal);
  if (firstScreen) {
    new IntersectionObserver(([e]) => {
      pastFirst = !e.isIntersecting && e.boundingClientRect.top < 0;
      sync();
    }).observe(firstScreen);
  }
  if (final) {
    new IntersectionObserver(([e]) => {
      atFinal = e.isIntersecting;
      sync();
    }, { threshold: 0 }).observe(final);
  }
}
