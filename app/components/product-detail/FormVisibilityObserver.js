"use client";
import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
//  FormVisibilityObserver
//
//  Watches #product-form with IntersectionObserver.
//  Adds/removes  body.form-in-view  class when the section
//  enters or leaves the viewport.
//
//  Components that should hide while the form is visible add:
//    :global(body.form-in-view) .yourClass { ... hide styles ... }
//
//  Returns null — no DOM output.
//  Place once inside the product detail page.
// ─────────────────────────────────────────────────────────────────
export default function FormVisibilityObserver() {
  useEffect(() => {
    const formEl = document.getElementById("product-form");

    // If this product has no embedded form, do nothing
    if (!formEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle class instantly — CSS transitions handle the animation
        document.body.classList.toggle("form-in-view", entry.isIntersecting);
      },
      {
        // Fire as soon as any pixel of the form enters or exits
        threshold: 0,
        // Trigger 20px early on the way down so the bar hides
        // before the form appears, not after
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(formEl);

    // Clean up on unmount (navigating away)
    return () => {
      observer.disconnect();
      document.body.classList.remove("form-in-view");
    };
  }, []);

  return null;
}
