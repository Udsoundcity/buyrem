"use client";
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────
//  CognitoFrame
//
//  Renders a Cognito Forms iframe that auto-resizes to its content.
//  Works by:
//    1. Starting with a tall initial height (no internal scroll)
//    2. Loading Cognito's iframe.js AFTER the iframe is mounted
//    3. Listening for postMessage height updates from the form
//
//  Place this file at: app/components/product-detail/CognitoFrame.js
// ─────────────────────────────────────────────────────────────────
export default function CognitoFrame({ src }) {
  const [height,  setHeight]  = useState(900); // tall default — prevents scroll
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    // ── 1. Listen for Cognito's resize postMessage ───────────────
    // Cognito iframe.js sends: { context: 'iframe.cognitoforms.com', height: N }
    const onMessage = (e) => {
      if (!e.data) return;
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;

        // Cognito's official format
        if (d?.context && String(d.context).includes("cognitoforms") && d.height > 0) {
          setHeight(Number(d.height) + 32); // 32px breathing room
          return;
        }
        // Fallback: any message with a reasonable height value
        if (d?.height > 200 && d?.height < 10000) {
          setHeight(Number(d.height) + 32);
        }
      } catch {
        // non-JSON messages from other sources — ignore
      }
    };

    window.addEventListener("message", onMessage);

    // ── 2. Inject iframe.js AFTER iframe is in the DOM ───────────
    // Waiting a tick ensures the iframe element exists when the
    // script runs its MutationObserver / querySelector scan.
    const SCRIPT_ID = "cognito-iframe-js";
    const timeout = setTimeout(() => {
      if (!document.getElementById(SCRIPT_ID)) {
        const s   = document.createElement("script");
        s.id      = SCRIPT_ID;
        s.src     = "https://www.cognitoforms.com/f/iframe.js";
        s.async   = true;
        s.onload  = () => setLoading(false);
        s.onerror = () => setLoading(false);
        document.body.appendChild(s);
      } else {
        setLoading(false);
      }
    }, 100);

    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timeout);
    };
  }, [src]);

  return (
    <div style={{ position: "relative" }}>
      {/* Loading shimmer */}
      {loading && (
        <div style={{
          position:  "absolute",
          inset:     0,
          minHeight: 120,
          background:"linear-gradient(90deg,#f5ede0 25%,#faf5ee 50%,#f5ede0 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          borderRadius: 8,
        }}>
          <style>{`
            @keyframes shimmer {
              0%   { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={src}
        allow="payment"
        title="Order form"
        onLoad={() => setLoading(false)}
        style={{
          width:   "100%",
          height:  height,
          border:  "none",
          display: "block",
          // Smooth height transitions when Cognito resizes
          transition: "height 0.3s ease",
        }}
      />
    </div>
  );
}
