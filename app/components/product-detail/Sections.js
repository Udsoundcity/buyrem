"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Sections.module.css";
import OrderModal from "./OrderModal";
import CartIcon from "@/app/components/CartIcon";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import CognitoFrame from "./CognitoFrame";

// ─── Helpers ──────────────────────────────────────────────────────
function scrollToForm() {
  document.getElementById("product-form")?.scrollIntoView({ behavior:"smooth" });
}

function useOrderAction(product) {
  const [modal, setModal] = useState(false);
  const trigger = () => product?.formLink ? scrollToForm() : setModal(true);
  return { modal, setModal, trigger };
}

function getEmbedUrl(input) {
  if (!input) return null;
  const src = input.match(/src=["']([^"']+)["']/);
  const url  = src ? src[1].trim() : input.trim();
  const ytW  = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
  if (ytW) return `https://www.youtube.com/embed/${ytW[1]}?rel=0`;
  const ytS  = url.match(/youtu\.be\/([^?\s]+)/);
  if (ytS) return `https://www.youtube.com/embed/${ytS[1]}?rel=0`;
  if (url.includes("youtube.com/embed/")) return url;
  const vm   = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

function detectFormType(code) {
  if (!code) return null;
  if (code.includes("<iframe")) return "iframe-code";
  if (code.includes("<script"))  return "script-only";
  return "url";
}

function ScriptInjector({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !code) return;
    el.innerHTML = "";
    const doc = new DOMParser().parseFromString(code, "text/html");
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
  return <div ref={ref} style={{ width:"100%" }} />;
}

// ─────────────────────────────────────────────────────────────────
// TRUST STRIP
// ─────────────────────────────────────────────────────────────────
export function TrustStrip() {
  const items = [
    { icon:"💵", label:"Pay on Delivery" },
    { icon:"✅", label:"Genuine Product" },
    { icon:"🚚", label:"Fast Nationwide Delivery" },
    { icon:"↩️", label:"5-Day Refund" },
    { icon:"⭐", label:"4.9/5 Rating" },
  ];
  return (
    <div className={styles.trustStrip}>
      {items.map(item => (
        <div key={item.label} className={styles.trustItem}>
          <span className={styles.trustIcon}>{item.icon}</span>
          <span className={styles.trustLabel}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PROBLEM SECTION
// ─────────────────────────────────────────────────────────────────
export function ProblemSection({ product }) {
  const p = product.problem;
  if (!p?.title && !p?.body) return null;
  return (
    <section className={styles.problem}>
      <div className="container">
        <span className={styles.eyebrow}>Sound familiar?</span>
        <h2 className={styles.problemHeadline}>{p.title}</h2>
        {p.body && <p className={styles.sectionBody}>{p.body}</p>}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SOLUTION SECTION
// ─────────────────────────────────────────────────────────────────
export function SolutionSection({ product }) {
  return (
    <section className={styles.solution}>
      <div className="container">
        <span className={styles.eyebrow}>The answer</span>
        <h2 className={styles.sectionTitle}>{product.name} is different.</h2>
        <p className={styles.sectionBody}>{product.description}</p>
        <div className={styles.solutionList}>
          {product.solutions?.map((s, i) => (
            <div key={i} className={styles.solutionItem}>
              <div className={styles.solutionIcon}>{s.icon}</div>
              <div>
                <div className={styles.solutionTitle}>{s.title}</div>
                <div className={styles.solutionBody}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// RESULTS LIST
// ─────────────────────────────────────────────────────────────────
export function ResultsList({ product }) {
  const feats = product.features?.filter(Boolean) || [];
  if (!feats.length) return null;
  return (
    <section className={styles.results}>
      <div className="container">
        <span className={styles.eyebrow}>What you get</span>
        <h2 className={styles.sectionTitle}>Real results.<br /><em>In real time.</em></h2>
        <div className={styles.resultsList}>
          {feats.slice(0, 6).map((f, i) => (
            <div key={i} className={styles.resultItem}>
              <div className={styles.resultCheck}>✓</div>
              <span className={styles.resultText}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// BEFORE/AFTER CAROUSEL (Usage Comparison)
// ─────────────────────────────────────────────────────────────────
export function BeforeAfterCarousel({ product }) {
  const uc = product.usageComparison;
  const pairs = (uc?.pairs || []).filter(p => p.before || p.after);
  if (!uc?.enabled || !pairs.length) return null;

  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!uc?.autoplay || pairs.length <= 1) return;
    const interval = uc.interval || 3000;
    const id = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % pairs.length;
        scrollRef.current?.scrollTo({ left: next * (scrollRef.current.offsetWidth * 0.78), behavior:"smooth" });
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [pairs.length, uc?.autoplay, uc?.interval]);

  return (
    <section className={styles.baSection}>
      <div className={styles.baHeader}>
        <h2 className={styles.baTitleText}>
          See the difference<br /><em>for yourself.</em>
        </h2>
      </div>

      <div ref={scrollRef} className={styles.baScroll}>
        {pairs.map((pair, i) => (
          <div key={i} className={styles.baCard}>
            <div className={styles.baImgGrid}>
              <div className={styles.baImgWrap}>
                {pair.before && <img src={pair.before} alt="Before" className={styles.baImg} />}
                <span className={styles.baTag}>BEFORE</span>
              </div>
              <div className={styles.baImgWrap}>
                {pair.after && <img src={pair.after} alt="After" className={styles.baImg} />}
                <span className={`${styles.baTag} ${styles.baTagAfter}`}>AFTER</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pairs.length > 1 && (
        <div className={styles.baDots}>
          {pairs.map((_, i) => (
            <button
              key={i}
              className={`${styles.baDot} ${active === i ? styles.baDotActive : ""}`}
              onClick={() => {
                setActive(i);
                scrollRef.current?.scrollTo({ left: i * (scrollRef.current.offsetWidth * 0.78), behavior:"smooth" });
              }}
              aria-label={`Pair ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOW IT WORKS — steps editable from admin panel
// Falls back to sensible defaults if no admin data set
// ─────────────────────────────────────────────────────────────────
export function HowItWorks({ product }) {
  const defaults = [
    { n:"01", title:"Cleanse your face",         desc:"Wash with warm water and gently pat dry." },
    { n:"02", title:`Apply ${product.name}`,      desc:"Use 3–4 drops and spread evenly every morning." },
    { n:"03", title:"See real results",           desc:"Visible improvement in 7 days. Full results in 30 days." },
  ];

  // Use admin-configured steps if set, else fall back to defaults
  const rawSteps  = product.howItWorks?.steps || [];
  const steps     = rawSteps.filter(s => s.title || s.desc).length
    ? rawSteps.filter(s => s.title || s.desc)
    : defaults;

  const eyebrow   = product.howItWorks?.eyebrow  || "Dead simple to use";
  const headline  = product.howItWorks?.headline  || "3 steps.";
  const subline   = product.howItWorks?.subline   || "That's it.";

  return (
    <section className={styles.howItWorks}>
      <div className="container">
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.sectionTitle}>
          {headline}<br /><em>{subline}</em>
        </h2>
        <div className={styles.stepsList}>
          {steps.map((s, i) => (
            <div key={i} className={styles.stepItem}>
              <div className={styles.stepNum}>{s.n || String(i+1).padStart(2,"0")}</div>
              <div>
                <div className={styles.stepTitle}>{s.title}</div>
                <div className={styles.stepDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// REVIEW SCREENSHOTS
// ─────────────────────────────────────────────────────────────────
export function ReviewScreenshots({ product }) {
  const shots = (product.reviewScreenshots || []).filter(Boolean);
  if (!shots.length) return null;
  return (
    <section className={styles.screenshots}>
      <div className="container">
        <span className={styles.eyebrow}>Customer Proof</span>
        <h2 className={styles.sectionTitle}>Review <em>Screenshots</em></h2>
        <div className={styles.shotGrid}>
          {shots.map((src, i) => (
            <div key={i} className={styles.shotCard}>
              <img src={src} alt={`Review ${i + 1}`} className={styles.shotImg} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────
export function TestimonialsSection({ product }) {
  const { modal, setModal, trigger } = useOrderAction(product);
  return (
    <>
      <section className={styles.testimonials}>
        <div className="container">
          <span className={styles.eyebrow}>Real customers</span>
          <h2 className={styles.sectionTitle}>
            They didn&apos;t<br /><em>believe it either.</em>
          </h2>
          <div className={styles.testiList}>
            {product.testimonials?.map((t, i) => (
              <div key={i} className={styles.testiCard}>
                <div className={styles.testiTop}>
                  <div className={styles.testiAvatar}>{t.name?.[0]}</div>
                  <div>
                    <div className={styles.testiName}>{t.name}</div>
                    <div className={styles.testiLoc}>📍 {t.location} · {"⭐".repeat(t.rating)}</div>
                  </div>
                </div>
                <p className={styles.testiText}>&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
          <button className={styles.testiCta} onClick={trigger}>
            <CartIcon size={16} /> Order Now — Same Results Await You
          </button>
        </div>
      </section>
      {modal && <OrderModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// URGENCY SECTION (countdown + CTA)
// ─────────────────────────────────────────────────────────────────
export function UrgencySection({ product }) {
  const { modal, setModal, trigger } = useOrderAction(product);
  const [time, setTime] = useState({ h:11, m:47, s:23 });

  useEffect(() => {
    const id = setInterval(() => setTime(p => {
      let s=p.s-1, m=p.m, h=p.h;
      if(s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=0;m=0;s=0;}
      return {h,m,s};
    }), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = n => String(n).padStart(2,"0");
  const saved = product.originalPrice - product.price;

  return (
    <>
      <section className={styles.urgency}>
        <div className="container">
          <p className={styles.urgencyLabel}>🔥 Limited time offer</p>
          <h2 className={styles.urgencyTitle}>
            Save ₦{saved.toLocaleString()} today.<br />Offer ends soon.
          </h2>
          <p className={styles.urgencySub}>
            Price returns to ₦{product.originalPrice.toLocaleString()} when the timer hits zero.
          </p>

          <div className={styles.timerRow}>
            {[["h","Hours"],["m","Mins"],["s","Secs"]].map(([k,l],i) => (
              <span key={k} style={{display:"contents"}}>
                {i > 0 && <span className={styles.timerSep}>:</span>}
                <div className={styles.timerBlock}>
                  <div className={styles.timerNum}>{pad(time[k])}</div>
                  <div className={styles.timerLabel}>{l}</div>
                </div>
              </span>
            ))}
          </div>

          <button className={styles.urgencyCta} onClick={trigger}>
            <CartIcon size={16} color="#D4544A" />
            {product.formLink ? "Order Now - Pay On Delivery ↓" : "Claim My Discount — Order Now"}
          </button>
          <p className={styles.urgencyNote}>Cash on delivery · No upfront · 5-day refund</p>
        </div>
      </section>
      {modal && <OrderModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// VIDEO SECTION
// ─────────────────────────────────────────────────────────────────
export function VideoSection({ product }) {
  const url = product.videoUrl;
  if (!url) return null;
  const embedUrl = getEmbedUrl(url);
  const isDirect = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
  return (
    <section className={styles.videoSection}>
      <div className="container">
        <span className={styles.eyebrow}>Watch It In Action</span>
        <h2 className={styles.sectionTitle}>Product <em>Illustration</em></h2>
        <div className={styles.videoBox}>
          {isDirect ? (
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

// ─────────────────────────────────────────────────────────────────
// CUSTOMER STORY
// ─────────────────────────────────────────────────────────────────
export function CustomerStory({ product }) {
  const { modal, setModal, trigger } = useOrderAction(product);
  const s = product.customerStory;
  if (!s?.enabled || (!s.headline && !s.content && !s.image)) return null;

   const ctaLabel = s.ctaType === "form"
  ? `📋 ${s.ctaText || "Order via Form"}`
  : `🛒 ${s.ctaText || "Order Now"}`;

  return (
    <>
      <section className={styles.customerStory}>
        <div className="container">
          <div className={`${styles.csGrid} ${!s.image ? styles.csNoImage : ""}`}>
            {s.image && (
              <div className={styles.csImgWrap}>
                <img src={s.image} alt={s.headline || "Customer story"} className={styles.csImg} />
              </div>
            )}
            <div className={styles.csBody}>
              {s.headline && <h2 className={styles.csHeadline}>{s.headline}</h2>}
              {s.content  && <p  className={styles.csContent}>{s.content}</p>}
              {s.ctaText  && (
                <button className={styles.csCtaBtn} onClick={trigger}>{ctaLabel}</button>
              )}
            </div>
          </div>
        </div>
      </section>
      {modal && <OrderModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOP STORY
// ─────────────────────────────────────────────────────────────────
export function TopStory({ product }) {
  const s = product.topStory;
  if (!s?.enabled || (!s.text && !s.image)) return null;
  return (
    <section className={styles.topStory}>
      <div className="container">
        {s.text  && <p  className={styles.topStoryText}>{s.text}</p>}
        {s.image && (
          <div className={styles.topStoryImgWrap}>
            <img src={s.image} alt="Story" className={styles.topStoryImg} />
          </div>
        )}
      </div>
    </section>
  );
}

export function EmbeddedForm({ product }) {
  const formLink = product.formLink;
  if (!formLink) return null;
 
  const type      = detectFormType(formLink);
  const isCognito = formLink.includes("cognitoforms.com");
 
  // Cognito URL typed/pasted as plain link → auto-resize via postMessage
  const useAutoResize = type === "url" && isCognito;
 
  return (
    <section className={styles.formSection} id="product-form">
      <div className="container">
        <span className={styles.eyebrow}>Place Your Order</span>
        <h2 className={styles.sectionTitle}>Order <em>Form</em></h2>
        <p className={styles.sectionBody} style={{ marginBottom: 32 }}>
          Fill in the form below. Payment on delivery — no upfront payment.
        </p>
 
        <div className={styles.formBox}>
          {useAutoResize ? (
            <CognitoFrame src={formLink} />
          ) : type === "url" ? (
            <iframe
              src={formLink}
              className={styles.formFrame}
              allow="payment"
              title="Order form"
              loading="lazy"
            />
          ) : (
            <ScriptInjector code={formLink} />
          )}
        </div>
 
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────
function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqOpen : ""}`}>
      <button className={styles.faqQ} onClick={() => setOpen(o => !o)}>
        <span>{item.q}</span>
        <span className={styles.faqIcon}>{open ? "−" : "+"}</span>
      </button>
      {open && <div className={styles.faqA}>{item.a}</div>}
    </div>
  );
}

export function FAQSection({ product }) {
  const faqs = product.faq?.filter(f => f.q) || [];
  if (!faqs.length) return null;
  return (
    <section className={styles.faqSection}>
      <div className="container">
        <span className={styles.eyebrow}>Still unsure?</span>
        <h2 className={styles.sectionTitle}>We&apos;ve got <em>answers.</em></h2>
        <div className={styles.faqList}>
          {faqs.map((f, i) => <FaqItem key={i} item={f} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// STATS (kept for backward compat, now subtle)
// ─────────────────────────────────────────────────────────────────
export function Stats({ product }) {
  const items = [
    { num:`${product.purchases?.toLocaleString()}+`, label:"Happy Customers" },
    { num:`${product.rating}⭐`,                     label:"Average Rating" },
    { num:`${product.reviews}+`,                     label:"Verified Reviews" },
    { num:`${product.satisfaction}%`,                label:"Satisfaction Rate" },
  ];
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.statsGrid}>
          {items.map((s,i) => (
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

// ─────────────────────────────────────────────────────────────────
// LIMITED OFFER (kept for compat — points to urgency section)
// ─────────────────────────────────────────────────────────────────
export function LimitedOffer({ product }) {
  // Redirect to the new UrgencySection above
  return <UrgencySection product={product} />;
}

// Kept for compat
export function ProblemSolution({ product }) {
  return (
    <>
      <ProblemSection  product={product} />
      <SolutionSection product={product} />
    </>
  );
}
export function Features({ product }) { return <ResultsList product={product} />; }
export function Testimonials({ product }) { return <TestimonialsSection product={product} />; }
export function ProductImages({ product }) {
  const imgs = product.images?.filter(i => i.src) || [];
  if (!imgs.length) return null;
  return (
    <section className={styles.screenshots}>
      <div className="container">
        <span className={styles.eyebrow}>Product Gallery</span>
        <h2 className={styles.sectionTitle}>See It <em>Up Close</em></h2>
        <div className={styles.shotGrid}>
          {imgs.map((img, i) => (
            <div key={i} className={styles.shotCard}>
              <img src={img.src} alt={img.alt} className={styles.shotImg} />
              {img.label && <div className={styles.shotLabel}>{img.label}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function FreeGift({ product }) {
  if (!product.freeGiftImage) return null;

  return (
    <section className={styles.freeGift}>
      <div className="container">
        {/* Header */}
        <div className={styles.fgHeader}>
          <div className={styles.fgBadge}>🎁 Special Bonus</div>
          <h2 className={styles.fgTitle}>
            You Get a <em>Free Gift</em> With Your Order!
          </h2>
          <p className={styles.fgSub}>
            Every order comes with an exclusive free gift — delivered straight
            to your door at no extra charge.
          </p>
        </div>

        {/* Gift image */}
        <div className={styles.fgImgWrap}>
          <img
            src={product.freeGiftImage}
            alt="Free gift included with your order"
            className={styles.fgImg}
          />
          <div className={styles.fgTag}>FREE with every order</div>
        </div>

        {/* Trust note */}
        <p className={styles.fgNote}>
          🎀 Gift is automatically included — no code needed. Pay on delivery only.
        </p>
      </div>
    </section>
  );
}