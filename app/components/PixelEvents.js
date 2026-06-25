"use client";
// ─────────────────────────────────────────────────────────────────
//  app/components/PixelEvents.js
//
//  Reusable client components for Meta Pixel conversion events.
//  Uses a retry loop so events fire correctly even if the pixel
//  script hasn't finished executing when the component mounts.
// ─────────────────────────────────────────────────────────────────
import { useEffect } from "react";

/**
 * Calls fbq() safely, retrying up to 5 seconds if the pixel
 * hasn't loaded yet (common with next/script afterInteractive).
 */
function safeFbq(event, params = {}) {
  let attempts = 0;
  const MAX = 50; // 50 × 100 ms = 5 seconds
  const attempt = () => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", event, params);
    } else if (attempts < MAX) {
      attempts++;
      setTimeout(attempt, 100);
    }
    // silently give up after 5 s — pixel not installed or blocked
  };

  attempt();
}

// ─────────────────────────────────────────────────────────────────
//  ViewContentTracker
//  Drop inside any product detail page.
//  Fires once per product ID — won't double-fire on re-renders.
// ─────────────────────────────────────────────────────────────────
export function ViewContentTracker({ product }) {
  useEffect(() => {
    safeFbq("ViewContent", {
      content_name:  product.name,
      content_ids:   [product.id],
      content_type:  "product",
      value:         product.price,   // already in Naira (e.g. 8500)
      currency:      "NGN",
    });
  }, [product.id]); // re-fires only if navigating between different products

  return null;
}

// ─────────────────────────────────────────────────────────────────
//  LeadTracker
//  Drop inside the order-confirmed page.
//
//  Deduplication strategy:
//    1. Only fires when Cognito's ?ref param is present in the URL
//       (absent on direct visits / refreshes without params).
//    2. Stores the ref in sessionStorage after firing so a browser
//       refresh — which preserves URL params — does NOT fire again.
// ─────────────────────────────────────────────────────────────────
export function LeadTracker({ refId }) {
  useEffect(() => {
    // Guard: no ref = not a genuine Cognito redirect
    if (!refId) return;

    // Guard: already tracked this submission in this browser session
    const storageKey = `px_lead_${refId}`;
    if (sessionStorage.getItem(storageKey)) return;

    // Fire Lead and mark as done
    let attempts = 0;
    const MAX = 50;
    const attempt = () => {
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "Lead");
        sessionStorage.setItem(storageKey, "1");
      } else if (attempts < MAX) {
        attempts++;
        setTimeout(attempt, 100);
      }
    };
    attempt();
  }, [refId]);

  return null;
}
