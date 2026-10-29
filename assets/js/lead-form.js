/**
 * Lead form: validation, payload assembly and honest submission states.
 * Success is shown — and Lead tracked — only when the submission adapter
 * returns "accepted".
 */
import { CONFIG, REVIEW_MODE } from "./config.js";
import { attributionPayload } from "./attribution.js";
import { submitLead } from "./submit.js";
import { track, newEventId } from "./tracking.js";

const RULES = {
  name: (v) => (v.length < 2 ? "Please enter your name." : v.length > 80 ? "Please keep your name under 80 characters." : ""),
  business: (v) =>
    v.length < 2 ? "Please enter your business or organisation." : v.length > 120 ? "Please keep this under 120 characters." : "",
  phone: (v) => (normalisePhone(v) ? "" : "Enter a phone or WhatsApp number, for example 078 123 4567 or +250 78 123 4567."),
  email: (v) => {
    if (!v) return CONFIG.form.emailRequired ? "Please enter your email address." : "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address, for example name@business.com.";
  },
  property_type: (v) => (v ? "" : "Please choose the type of property."),
  location: (v) => (v.length < 2 ? "Please tell us where the property is." : v.length > 120 ? "Please keep this under 120 characters." : ""),
  size: (v) => (v.length < 1 ? "Please give an approximate size or number of rooms/units." : v.length > 120 ? "Please keep this under 120 characters." : ""),
  description: (v) => {
    const { descriptionMin: min, descriptionMax: max } = CONFIG.form;
    if (v.length < min) return `Please add a short description (at least ${min} characters).`;
    if (v.length > max) return `Please keep the description under ${max} characters.`;
    return "";
  },
};

/** Returns +E.164 or null. Local Rwandan formats (07…, 7…) gain +250. */
export function normalisePhone(raw) {
  let v = String(raw || "").replace(/[\s().\-]/g, "");
  if (v.startsWith("00")) v = "+" + v.slice(2);
  if (/^0?7\d{8}$/.test(v)) return "+250" + v.slice(-9);
  if (/^\+?\d{9,15}$/.test(v)) return v.startsWith("+") ? v : "+" + v;
  return null;
}

export function mountLeadForm(section) {
  const form = section.querySelector("[data-lead-form]");
  const submitBtn = form.querySelector("[type=submit]");
  const summary = form.querySelector("[data-form-summary]");
  const notice = section.querySelector("[data-form-notice]");
  const success = section.querySelector("[data-form-success]");
  const counter = form.querySelector("[data-desc-count]");
  const emailInput = form.elements.email;
  const emailMarker = form.querySelector("[data-email-marker]");
  const names = Object.keys(RULES);

  // Email policy from config.
  emailInput.required = CONFIG.form.emailRequired;
  if (emailMarker) {
    emailMarker.innerHTML = CONFIG.form.emailRequired
      ? '<span class="req" aria-hidden="true">*</span>'
      : '<span class="opt">(optional)</span>';
  }
  form.elements.description.maxLength = CONFIG.form.descriptionMax;

  let attempted = false;
  let inFlight = false;
  let eventId = newEventId(); // reused across retries of the same enquiry

  const value = (n) => (form.elements[n].value || "").trim();

  function setError(n, msg) {
    const input = form.elements[n];
    const err = form.querySelector(`#lf-${n}-error`);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    input.closest(".field").classList.toggle("has-error", Boolean(msg));
    if (err) err.textContent = msg;
  }

  function validate() {
    const bad = [];
    for (const n of names) {
      const msg = RULES[n](value(n));
      setError(n, msg);
      if (msg) bad.push(n);
    }
    return bad;
  }

  function showSummary(text) {
    summary.textContent = text;
    summary.hidden = !text;
  }

  form.addEventListener("input", (e) => {
    const n = e.target.name;
    if (n === "description" && counter) {
      counter.textContent = `${e.target.value.length} / ${CONFIG.form.descriptionMax}`;
    }
    if (attempted && RULES[n]) {
      setError(n, RULES[n](value(n)));
      const remaining = names.filter((x) => RULES[x](value(x))).length;
      showSummary(remaining ? `${remaining} ${remaining === 1 ? "field needs" : "fields need"} attention.` : "");
    }
  });
  form.addEventListener(
    "blur",
    (e) => {
      const n = e.target.name;
      if (n === "phone") {
        const p = normalisePhone(e.target.value);
        if (p && attempted) setError(n, "");
      }
      if (RULES[n] && value(n)) setError(n, RULES[n](value(n)));
    },
    true,
  );

  function buildPayload() {
    const select = form.elements.property_type;
    return {
      event_id: eventId,
      service: CONFIG.page.service,
      page_id: CONFIG.page.id,
      fields: {
        name: value("name"),
        business: value("business"),
        phone: normalisePhone(value("phone")),
        phone_raw: value("phone"),
        whatsapp_ok: form.elements.whatsapp_ok.checked,
        email: value("email") || null,
        property_type: select.value,
        property_type_label: select.options[select.selectedIndex].text,
        location: value("location"),
        size: value("size"),
        description: value("description"),
      },
      attribution: attributionPayload(),
      submitted_at: new Date().toISOString(),
      consent: { status: "not_collected", note: "No consent mechanism is implemented on this page yet." },
      client: { user_agent: navigator.userAgent, review_mode: REVIEW_MODE },
    };
  }

  function mailtoHref(p) {
    const f = p.fields;
    const body = [
      "Virtual tour enquiry",
      "",
      `Name: ${f.name}`,
      `Business: ${f.business}`,
      `Phone/WhatsApp: ${f.phone || f.phone_raw}`,
      f.email ? `Email: ${f.email}` : null,
      `Property type: ${f.property_type_label}`,
      `Location: ${f.location}`,
      `Size: ${f.size}`,
      "",
      f.description,
    ]
      .filter((l) => l !== null)
      .join("\n");
    return `mailto:${CONFIG.contact.email}?subject=${encodeURIComponent(
      `Virtual tour enquiry: ${f.business}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  function showNotice(kind, html) {
    notice.dataset.kind = kind;
    notice.innerHTML = html;
    notice.hidden = false;
    notice.focus({ preventScroll: false });
  }

  function setBusy(on) {
    inFlight = on;
    submitBtn.disabled = on;
    form.setAttribute("aria-busy", String(on));
    submitBtn.classList.toggle("is-busy", on);
    submitBtn.querySelector("[data-label]").textContent = on ? "Sending…" : "Send enquiry";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (inFlight) return; // duplicate-submit guard
    attempted = true;
    notice.hidden = true;

    const bad = validate();
    if (bad.length) {
      showSummary(`${bad.length} ${bad.length === 1 ? "field needs" : "fields need"} attention.`);
      form.elements[bad[0]].focus();
      return;
    }
    showSummary("");

    // Honeypot: bots fill hidden fields. Do nothing and claim nothing.
    if (form.elements.website.value) return;

    const payload = buildPayload();
    setBusy(true);
    const result = await submitLead(payload);
    setBusy(false);

    if (result.status === "accepted") {
      track(
        "Lead",
        { content_name: CONFIG.page.service, content_category: payload.fields.property_type },
        { eventID: payload.event_id },
      );
      form.hidden = true;
      const ref = success.querySelector("[data-lead-ref]");
      if (ref) ref.textContent = result.leadId ? `Reference: ${result.leadId}` : "";
      success.hidden = false;
      success.querySelector("h2, h3").focus();
      eventId = newEventId();
      return;
    }

    if (result.status === "not_connected") {
      showNotice(
        "warn",
        `<p class="notice-title">Online enquiries are not connected yet. Nothing has been sent.</p>
         <p>Your details are still in the form. You can send them to us by email instead. Your email app will open with everything filled in.</p>
         <a class="btn btn-ghost" data-contact="email" data-placement="form-fallback" href="${mailtoHref(payload)}">Email these details to ${CONFIG.contact.email}</a>
         ${REVIEW_MODE ? '<p class="notice-dev">Review mode: set <code>CONFIG.submission.endpoint</code> in assets/js/config.js once the backend exists.</p>' : ""}`,
      );
      return;
    }

    if (result.status === "rejected") {
      let first = null;
      for (const [n, msg] of Object.entries(result.fieldErrors || {})) {
        if (form.elements[n]) {
          setError(n, String(msg));
          first = first || n;
        }
      }
      showNotice("error", `<p class="notice-title">Some details need checking before we can accept the enquiry.</p>`);
      if (first) form.elements[first].focus();
      return;
    }

    const offline = result.reason === "offline";
    showNotice(
      "error",
      `<p class="notice-title">${offline ? "You appear to be offline." : "We couldn't send your enquiry just now."} It has not been received.</p>
       <p>Your details are still here. Please try again${offline ? " when you're connected" : ""}, or email them to us.</p>
       <a class="btn btn-ghost" data-contact="email" data-placement="form-error" href="${mailtoHref(payload)}">Email these details instead</a>`,
    );
  });

  return {
    prefillType(type) {
      const sel = form.elements.property_type;
      if ([...sel.options].some((o) => o.value === type)) sel.value = type;
    },
  };
}
