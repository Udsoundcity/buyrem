"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./Sections.module.css";
import OrderModal from "./OrderModal";

// ─── Video URL normaliser ─────────────────────────────────────────
// Accepts: watch URL, short URL, full <iframe> HTML, or embed URL
function getEmbedUrl(input) {
  if (!input) return null;

  // If user pasted full <iframe …> HTML, pull out the src value
  const srcFromHtml = input.match(/src=["']([^"']+)["']/);
  const url = srcFromHtml ? srcFromHtml[1].trim() : input.trim();

  // YouTube watch URL → embed
  const ytWatch = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?rel=0`;

  // YouTube short URL  youtu.be/…
  const ytShort = url.match(/youtu\.be\/([^?\s]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?rel=0`;

  // Already an embed URL
  if (url.includes("youtube.com/embed/")) return url;

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  // Direct video file
  return url;
}

// ─── Form-type detection ──────────────────────────────────────────
function detectFormType(code) {
  if (!code) return null;
  const hasScript = code.includes("<script");
  const hasIframe = code.includes("<iframe");
  if (hasIframe) return "iframe-code";   // iframe ± scripts
  if (hasScript) return "script-only";   // seamless.js style
  return "url";                          // plain URL
}

// Renders arbitrary embed HTML (iframes + scripts) by injecting into DOM
function ScriptInjector({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !code) return;
    el.innerHTML = "";
    const parser = new DOMParser();
    const doc    = parser.parseFromString(code, "text/html");
    Array.from(doc.body.childNodes).forEach(node => {
      if (node.nodeName === "SCRIPT") {
        const s = document.createElement("script");
        Array.from(node.attributes).forEach(a => s.setAttribute(a.name, a.value));
        if (node.textContent) s.textContent = node.textContent;
        el.appendChild(s);
      } else if (node.nodeType === 1) {
        el.appendChild(node.cloneNode(true));
      }
    });
  }, [code]);
  return <div ref={ref} style={{ width: "100%" }} />;
}

function isDirectVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

function scrollToForm() {
  document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
}

export function Stats({ product }) {
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.statsGrid}>
          {[
            { num:`${product.purchases.toLocaleString()}+`, label:"Happy Customers" },
            { num:`${product.rating}⭐`,                    label:"Average Rating" },
            { num:`${product.reviews}+`,                    label:"Verified Reviews" },
            { num:`${product.satisfaction}%`,               label:"Satisfaction Rate" },
          ].map((s,i)=>(
            <div key={i} className={styles.statCard}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProblemSolution({ product }) {
  return (
    <section className={styles.ps}>
      <div className="container">
        <div className={styles.psGrid}>
          <div>
            <div className={styles.psTag}>😔 The Problem</div>
            <h2 className="sec-title">{product.problem.title}</h2>
            <p className="sec-sub">{product.problem.body}</p>
          </div>
          <div>
            <div className={styles.psTag} style={{color:"#2A8C52"}}>✅ The Solution</div>
            <div className={styles.solutionList}>
              {product.solutions.map((s,i)=>(
                <div key={i} className={styles.solution}>
                  <div className={styles.solIcon}>{s.icon}</div>
                  <div>
                    <div className={styles.solTitle}>{s.title}</div>
                    <div className={styles.solBody}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features({ product }) {
  return (
    <section className={styles.features}>
      <div className="container">
        <span className="eyebrow">What You Get</span>
        <h2 className="sec-title">Product <em>Features</em></h2>
        <div className={styles.featGrid}>
          {product.features.filter(Boolean).map((f,i)=>(
            <div key={i} className={styles.feat}>
              <div className={styles.featCheck}>✓</div>
              <span className={styles.featText}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ product }) {
  return (
    <section className={styles.testimonials}>
      <div className="container">
        <span className="eyebrow">What Customers Say</span>
        <h2 className="sec-title">Real <em>Reviews</em></h2>
        <div className={styles.testiGrid}>
          {product.testimonials.map((t,i)=>(
            <div key={i} className={styles.testi}>
              <div className={styles.testiStars}>{"⭐".repeat(t.rating)}</div>
              <p className={styles.testiText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.testiAuthor}>
                <div className={styles.testiAvatar}>{t.name[0]}</div>
                <div>
                  <div className={styles.testiName}>{t.name}</div>
                  <div className={styles.testiLoc}>📍 {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── NEW: Review Screenshots ── */
export function ReviewScreenshots({ product }) {
  const shots = (product.reviewScreenshots || []).filter(Boolean);
  if (!shots.length) return null;
  return (
    <section className={styles.screenshots}>
      <div className="container">
        <span className="eyebrow">Customer Proof</span>
        <h2 className="sec-title">Review <em>Screenshots</em></h2>
        <p className="sec-sub">Real feedback from real customers.</p>
        <div className={styles.shotGrid}>
          {shots.map((src,i)=>(
            <div key={i} className={styles.shotCard}>
              <img src={src} alt={`Customer review ${i+1}`} className={styles.shotImg} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductImages({ product }) {
  return (
    <section className={styles.images}>
      <div className="container">
        <span className="eyebrow">Product Gallery</span>
        <h2 className="sec-title">See It <em>Up Close</em></h2>
        <div className={styles.imgGrid}>
          {product.images.map((img,i)=>(
            <div key={i} className={`${styles.imgCard} ${i===0?styles.imgMain:""}`}>
              <div className={styles.imgWrap} style={{background:product.bg}}>
                <img src={img.src} alt={img.alt} className={styles.imgPhoto} />
              </div>
              <div className={styles.imgLabel}>{img.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── NEW: Video Section ── */
export function VideoSection({ product }) {
  const url = product.videoUrl;
  if (!url) return null;
  const embedUrl = getEmbedUrl(url);
  const direct   = isDirectVideo(url);
  return (
    <section className={styles.videoSection}>
      <div className="container">
        <span className="eyebrow">Watch It In Action</span>
        <h2 className="sec-title">Product <em>Illustration</em></h2>
        <div className={styles.videoBox}>
          {direct ? (
            <video src={url} controls playsInline className={styles.videoEl} />
          ) : (
            <iframe src={embedUrl} className={styles.videoFrame}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen title="Product illustration video" />
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Updated: LimitedOffer — respects formLink ── */
export function LimitedOffer({ product }) {
  const [modal, setModal] = useState(false);
  const saved = product.originalPrice - product.price;

  const handleOrder = () =>
    product.formLink ? scrollToForm() : setModal(true);

  return (
    <>
      <section className={styles.offer}>
        <div className="container">
          <div className={styles.offerInner}>
            <div className={styles.offerEmoji}>
              {product.thumbnail
                ? <img src={product.thumbnail} alt={product.name}
                    style={{width:80,height:80,borderRadius:16,objectFit:"cover"}} />
                : "🛍️"}
            </div>
            <div className={styles.offerText}>
              <div className={styles.offerEyebrow}>🎉 Limited Time Deal</div>
              <h2 className={styles.offerTitle}>
                Get {product.name} for only <span>₦{product.price.toLocaleString()}</span>
              </h2>
              <p className={styles.offerSub}>
                Save ₦{saved.toLocaleString()} off the original price. Pay on delivery — no risk.
              </p>
            </div>
            <div className={styles.offerAction}>
              <button className="btn-wa" onClick={handleOrder}>
                             {product.formLink
  ? <><i className="fa-solid fa-file-lines"></i> Fill Order Form ↓</>
  : <><i className="fa-solid fa-cart-shopping"></i> Order Now — Pay Later</>
}
              </button>
              <p className={styles.offerNote}>⏰ Offer expires soon</p>
            </div>
          </div>
        </div>
      </section>
      {modal && <OrderModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}

/* ── EmbeddedForm — auto-detects URL / iframe code / script embed ── */
export function EmbeddedForm({ product }) {
  const formLink = product.formLink;
  if (!formLink) return null;

  const type = detectFormType(formLink);

  return (
    <section className={styles.formSection} id="product-form">
      <div className="container">
        <span className="eyebrow">Place Your Order</span>
        <h2 className="sec-title">Order <em>Form</em></h2>
        <p className="sec-sub" style={{ marginBottom: 32 }}>
          Fill in the form below to place your order. Payment is on delivery — no upfront payment required.
        </p>

        <div className={styles.formBox}>
          {type === "url" ? (
            /* Plain URL — render as iframe */
            <iframe
              src={formLink}
              className={styles.formFrame}
              allow="payment"
              title="Order form"
              loading="lazy"
            />
          ) : (
            /* Embed code (iframe HTML or seamless script) — inject into DOM */
            <ScriptInjector code={formLink} />
          )}
        </div>

        <p className={styles.formNote}>
          🔒 Your information is safe and only used to process your order.
        </p>
      </div>
    </section>
  );
}
