"use client";
import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
//  FormVisibilityObserver
//
//  Watches BOTH #top-story AND #product-form via IntersectionObserver.
//  Toggles body classes used by CSS to hide sticky bar + WA button:
//
//    body.form-in-view        → form section visible
//    body.topstory-in-view    → top story section visible
//
//  CSS in ProductHero.module.css and Nav.module.css handles hiding.
//  Returns null — no DOM output.
// ─────────────────────────────────────────────────────────────────
export default function FormVisibilityObserver() {
  useEffect(() => {
    const targets = [
      { id: "top-story",    cls: "topstory-in-view" },
      { id: "product-form", cls: "form-in-view"     },
    ];

    const observers = targets.map(({ id, cls }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          document.body.classList.toggle(cls, entry.isIntersecting);
        },
        {
          threshold:  0,
          // Trigger 20px before the section enters so the bar
          // hides just before the section appears
          rootMargin: "0px 0px -20px 0px",
        }
      );

      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach(o => o?.disconnect());
      // Clean up both classes on unmount
      document.body.classList.remove("form-in-view", "topstory-in-view");
    };
  }, []);

  return null;
}