/**
 * Submission adapter — the only module that talks to a backend.
 *
 * Returns one of:
 *   { status: "accepted", leadId }       backend stored the enquiry (HTTP 2xx + {ok:true})
 *   { status: "not_connected" }          no endpoint configured (nothing was sent)
 *   { status: "rejected", fieldErrors }  backend refused the data (HTTP 400/422)
 *   { status: "error", reason }          network/timeout/server failure (safe to retry)
 *
 * The UI may only show success for "accepted". Contract: README.md.
 */
import { CONFIG } from "./config.js";

export async function submitLead(payload) {
  const { endpoint, timeoutMs } = CONFIG.submission;
  if (!endpoint) return { status: "not_connected" };

  if (navigator.onLine === false) return { status: "error", reason: "offline" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": payload.event_id },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      credentials: "omit",
    });
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    if (res.ok && body && body.ok === true) return { status: "accepted", leadId: body.lead_id || null };
    if (res.status === 400 || res.status === 422) {
      return { status: "rejected", fieldErrors: (body && body.field_errors) || {} };
    }
    return { status: "error", reason: `http_${res.status}` };
  } catch (err) {
    return { status: "error", reason: err && err.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}
