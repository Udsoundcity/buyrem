// ─── CONFIGURATION ──────────────────────────────────────────────
export const WHATSAPP_NUMBER = "2347067584692"; // ← Your WhatsApp number
export const STORE_NAME      = "BuyRem";
export const STORE_TAGLINE   = "Beauty · Electronics · Health";
export const STORE_LOCATION  = "Lagos, Nigeria";

// ─── HOW TO ADD YOUR OWN IMAGES ─────────────────────────────────
// Option A — Local files (recommended for your own product photos):
//   1. Create a folder: public/images/
//   2. Add your photos: public/images/serum-front.jpg
//   3. Use as: thumbnail: "/images/serum-front.jpg"
//
// Option B — External URLs (e.g. Google Drive, Cloudinary, Imgur):
//   thumbnail: "https://your-image-host.com/serum.jpg"
//
// Each product needs:
//   - thumbnail : shown on the product card (homepage & products page)
//   - images[]  : 4 photos shown in the product detail gallery
// ─────────────────────────────────────────────────────────────────

export const PRODUCTS = [
  {
    id: "vitamin-c-serum",
    cat: "Beauty",
    bg: "#F7E0D0",                        // fallback bg colour while image loads
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    name: "Vitamin C Glow Serum",
    tagline: "Brighter skin in 7 days — or your money back.",
    price: 8500,
    originalPrice: 12000,
    badge: "Bestseller",
    badgeColor: "#D4544A",
    purchases: 847,
    rating: 4.9,
    reviews: 312,
    satisfaction: 98,

    description:
      "Our Vitamin C Glow Serum is a high-potency brightening formula packed with 20% pure Vitamin C, hyaluronic acid, and niacinamide. Visible results in just 7 days.",

    problem: {
      title: "Struggling with dull, uneven skin?",
      body: "Many Nigerian women deal with hyperpigmentation, dark spots from sun exposure, and an uneven skin tone. Most products are either too harsh, too expensive, or simply don't work for our skin type.",
    },

    solutions: [
      { icon: "🌟", title: "Fades dark spots",       body: "20% Vitamin C breaks down melanin clusters, visibly reducing dark spots within 2 weeks." },
      { icon: "💧", title: "Deep hydration",          body: "Hyaluronic acid locks in moisture all day, leaving skin plump and dewy — not greasy." },
      { icon: "🛡️", title: "Protects against damage", body: "Antioxidant-rich formula shields skin from pollution and UV damage daily." },
    ],

    features: [
      "20% Pure Vitamin C — maximum brightening strength",
      "Hyaluronic Acid for all-day deep hydration",
      "Niacinamide to tighten pores and smooth texture",
      "Fragrance-free — safe for sensitive skin",
      "Dermatologist tested and approved",
      "Works on all Nigerian skin tones",
    ],

    // ← Replace these URLs with your own product photos
    images: [
      { src: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80", alt: "Vitamin C Glow Serum bottle", label: "Product Front" },
      { src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80", alt: "Serum ingredients close-up",   label: "Key Ingredients" },
      { src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80", alt: "Applying serum to face",         label: "How to Apply" },
      { src: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80", alt: "Full skincare kit",            label: "Full Kit" },
    ],

    testimonials: [
      { name: "Amaka O.",    location: "Surulere, Lagos", rating: 5, text: "I've tried so many serums. This one actually works! My dark spots faded in 3 weeks. I get compliments every day now." },
      { name: "Chidinma E.", location: "Ikeja, Lagos",    rating: 5, text: "My skin is literally glowing. Worth every naira!" },
      { name: "Fatima A.",   location: "Lekki, Lagos",    rating: 5, text: "Delivery was fast and genuine. Lightweight — perfect for Lagos weather." },
    ],

    faq: [
      { q: "How soon will I see results?",    a: "Most customers notice brighter skin within 7–14 days. Full results in 4–6 weeks." },
      { q: "Is it safe for dark skin?",       a: "Yes! Tested for melanin-rich skin tones. No risk of bleaching." },
      { q: "How do I use it?",                a: "Apply 3–4 drops to clean, dry skin every morning before moisturiser and SPF." },
      { q: "What if it doesn't work for me?", a: "Full refund within 14 days. Just WhatsApp us with your order details." },
    ],
  },

  {
    id: "wireless-earbuds",
    cat: "Electronics",
    bg: "#1a1a3e",
    thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    name: "Pro Wireless Earbuds",
    tagline: "Studio sound. All-day battery. Lagos-proof.",
    price: 18500,
    originalPrice: 25000,
    badge: "Top Rated",
    badgeColor: "#3A5ACC",
    purchases: 1243,
    rating: 4.8,
    reviews: 489,
    satisfaction: 97,

    description:
      "Bluetooth 5.0 earbuds with active noise cancellation, 32-hour total battery, and IPX5 sweat resistance. Crystal-clear calls and powerful bass.",

    problem: {
      title: "Tired of tangled cables and dead earphones?",
      body: "Cheap earphones break within weeks, sound quality is terrible on calls, and the battery dies right when you need it most.",
    },

    solutions: [
      { icon: "🔊", title: "Studio-quality sound", body: "12mm dynamic drivers deliver powerful bass and crisp highs." },
      { icon: "🔋", title: "32-hour battery",      body: "8 hours per charge + 24 hours from the charging case." },
      { icon: "📞", title: "Crystal-clear calls",  body: "4 built-in microphones with AI noise cancellation." },
    ],

    features: [
      "Bluetooth 5.0 — stable connection up to 10 metres",
      "Active Noise Cancellation (ANC)",
      "32-hour total battery (8hrs buds + 24hrs case)",
      "IPX5 water & sweat resistant",
      "Touch controls — play, pause, skip, calls",
      "Works with iPhone, Android, Tecno, Infinix",
    ],

    images: [
      { src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80", alt: "Pro wireless earbuds",          label: "Earbuds" },
      { src: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=800&q=80", alt: "Earbuds in charging case",      label: "With Case" },
      { src: "https://images.unsplash.com/photo-1628293117874-1dceea8b6166?w=800&q=80", alt: "Earbuds charging",             label: "Charging" },
      { src: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",    alt: "Earbuds paired with phone",    label: "Paired" },
    ],

    testimonials: [
      { name: "Emeka N.",   location: "Victoria Island, Lagos", rating: 5, text: "Best earbuds I've bought in Nigeria. ANC actually works on Third Mainland Bridge traffic!" },
      { name: "Tunde B.",   location: "Yaba, Lagos",            rating: 5, text: "Crystal clear on calls, my colleagues keep asking what earphones I'm using." },
      { name: "Blessing K.", location: "Ajah, Lagos",           rating: 4, text: "Battery life is amazing. I charge it once Monday and it lasts all week." },
    ],

    faq: [
      { q: "Does it work with Tecno and Infinix?",    a: "Yes! Works with any Bluetooth device — iPhone, Samsung, Tecno, Infinix, Itel." },
      { q: "Is the noise cancellation good?",          a: "Reduces background noise by up to 35dB. Great for busy Lagos environments." },
      { q: "What if one earbud stops working?",        a: "3-month warranty. WhatsApp us and we'll replace any faulty unit." },
      { q: "Can I use just one earbud?",               a: "Yes, both earbuds work independently." },
    ],
  },

  {
    id: "moringa-capsules",
    cat: "Health",
    bg: "#D4E4CC",
    thumbnail: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80",
    name: "Organic Moringa Capsules",
    tagline: "Nigeria's superfood. Now in a capsule.",
    price: 4800,
    originalPrice: 7000,
    badge: "Popular",
    badgeColor: "#2A8C52",
    purchases: 634,
    rating: 4.9,
    reviews: 201,
    satisfaction: 99,

    description:
      "100% pure, organically grown Nigerian moringa leaf powder. Packed with iron, calcium, Vitamin A, and antioxidants. 60 capsules — a full month's supply.",

    problem: {
      title: "Low energy, poor immunity, nutritional gaps?",
      body: "With busy Lagos lifestyles, many Nigerians suffer from fatigue, low immunity, and nutritional deficiencies without even knowing it.",
    },

    solutions: [
      { icon: "⚡", title: "Natural energy boost",      body: "Moringa contains all 9 essential amino acids and iron — combating fatigue without caffeine." },
      { icon: "🛡️", title: "Immune system support",    body: "7x more Vitamin C than oranges. Fights infections and keeps you strong." },
      { icon: "🌱", title: "100% Nigerian & organic",   body: "Grown right here in Nigeria without pesticides. Supporting local farmers." },
    ],

    features: [
      "100% pure organic moringa leaf — no fillers",
      "60 capsules — full 30-day supply",
      "Rich in iron, calcium, Vitamin A, C & E",
      "All 9 essential amino acids",
      "NAFDAC approved",
      "Suitable for adults, including pregnant women",
    ],

    images: [
      { src: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80", alt: "Moringa capsules bottle",        label: "Capsules" },
      { src: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&q=80", alt: "Fresh moringa leaves",        label: "Moringa Plant" },
      { src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80", alt: "Supplement capsules closeup", label: "Lab Tested" },
      { src: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80", alt: "Natural herbal packaging",    label: "Packaging" },
    ],

    testimonials: [
      { name: "Ngozi M.",     location: "Ikoyi, Lagos",    rating: 5, text: "My energy levels are through the roof! I no longer feel tired after work. Genuinely life-changing." },
      { name: "Pastor Ade F.", location: "Alimosho, Lagos", rating: 5, text: "NAFDAC approved, good quality. My blood results have improved significantly." },
      { name: "Mrs. Okonkwo", location: "Surulere, Lagos", rating: 5, text: "Bought for my husband and I. We both feel more energetic this harmattan season." },
    ],

    faq: [
      { q: "Is it NAFDAC approved?",           a: "Yes, fully NAFDAC approved. We can share the number on request." },
      { q: "Can pregnant women take it?",       a: "Yes, safe and recommended for its iron content. Consult your doctor first." },
      { q: "How long before I see results?",    a: "Most feel more energetic within the first week. Full benefits in 4–6 weeks." },
      { q: "How many capsules per day?",        a: "2 capsules daily with water, preferably in the morning with breakfast." },
    ],
  },

  {
    id: "hair-growth-oil",
    cat: "Beauty",
    bg: "#F5D0E0",
    thumbnail: "/images/box.png",
    name: "Hair Growth Oil",
    tagline: "Stop hair fall. Start growing — in 30 days.",
    price: 6000,
    originalPrice: 9500,
    badge: "Fan Favourite",
    badgeColor: "#C4714A",
    purchases: 921,
    rating: 4.8,
    reviews: 378,
    satisfaction: 96,

    description:
      "A powerful blend of castor oil, coconut oil, argan oil, and biotin designed specifically for natural African hair. Reduces breakage, promotes thickness.",

    problem: {
      title: "Hair breaking off? Edges thinning? Growth stalled?",
      body: "The Lagos climate, heat styling, chemicals, and stress take a serious toll on African hair. Many women spend money on products that promise results but deliver nothing.",
    },

    solutions: [
      { icon: "🌱", title: "Stimulates growth", body: "Castor oil increases blood circulation to the scalp, triggering dormant follicles to grow." },
      { icon: "💪", title: "Stops breakage",    body: "Biotin and argan oil strengthen hair strands, reducing breakage by up to 80%." },
      { icon: "✨", title: "Restores edges",    body: "Visible regrowth at edges and temples within 4–6 weeks." },
    ],

    features: [
      "100% pure castor oil base (no mineral oil)",
      "Enriched with argan, coconut & biotin",
      "Formulated for natural African hair textures",
      "No parabens, sulfates, or harmful chemicals",
      "Works on locs, braids, relaxed & natural hair",
      "250ml — 2–3 months supply",
    ],

    images: [
      { src: "/images/box.png", alt: "Hair growth oil bottle",     label: "The box" },
      { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", alt: "Hair oil texture closeup",  label: "Oil Texture" },
      { src: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=800&q=80", alt: "Healthy hair result",       label: "Results" },
      { src: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80",    alt: "Hair oil packaging",        label: "Packaging" },
    ],

    testimonials: [
      { name: "Adaeze I.", location: "Lekki, Lagos",    rating: 5, text: "My edges are BACK! After years of thinning, 6 weeks of this oil and people are asking what I'm doing differently." },
      { name: "Sade L.",   location: "Ikeja GRA, Lagos", rating: 5, text: "I've bought expensive oils from abroad. This one is honestly better." },
      { name: "Kemi A.",   location: "Magodo, Lagos",   rating: 4, text: "Less hair falling out in the shower. Very happy with this purchase." },
    ],

    faq: [
      { q: "How often should I apply?",         a: "Apply 2–3 times per week. Massage into scalp for 5 minutes." },
      { q: "Does it work on relaxed hair?",      a: "Yes — all hair types: natural, relaxed, loc'd, and transitioning." },
      { q: "Will it make my hair greasy?",       a: "No — a little goes a long way. It absorbs well into the scalp." },
      { q: "When will I see hair growth?",       a: "Less hair fall within 2 weeks. Visible new growth in 4–6 weeks." },
    ],
  },

  {
    id: "fast-charger",
    cat: "Electronics",
    bg: "#1a2d1a",
    thumbnail: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    name: "65W GaN Fast Charger",
    tagline: "0 to 80% in 35 minutes. Every phone. Every time.",
    price: 5500,
    originalPrice: 8000,
    badge: "Essential",
    badgeColor: "#3A5ACC",
    purchases: 1876,
    rating: 4.7,
    reviews: 654,
    satisfaction: 95,

    description:
      "Ultra-compact 65W GaN fast charger with USB-C and USB-A ports. Charges phones, tablets, and laptops simultaneously. NEPA-spike protected.",

    problem: {
      title: "Slow charging, fried phones, and NEPA surges?",
      body: "Cheap chargers damage batteries, cause overheating, and offer zero protection against power surges common in Nigeria.",
    },

    solutions: [
      { icon: "⚡", title: "Blazing fast charging",   body: "65W charges your phone from 0 to 80% in just 35 minutes." },
      { icon: "🛡️", title: "NEPA surge protection", body: "Built-in protection keeps your device safe during power fluctuations." },
      { icon: "📱", title: "Charges everything",      body: "USB-C + USB-A ports charge phone, tablet, and laptop simultaneously." },
    ],

    features: [
      "65W GaN technology — ultra compact & powerful",
      "Dual ports: USB-C (65W) + USB-A (22.5W)",
      "Charges phone + laptop simultaneously",
      "NEPA surge & voltage spike protection",
      "Over-temperature & short circuit protection",
      "Compatible with all phones, tablets & MacBooks",
    ],

    images: [
      { src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", alt: "65W GaN fast charger",          label: "Charger" },
      { src: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800&q=80", alt: "USB-C and USB-A ports",         label: "Ports" },
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",    alt: "Charger in use with phone",     label: "In Use" },
      { src: "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=800&q=80", alt: "Charger packaging box",         label: "Package" },
    ],

    testimonials: [
      { name: "Gbenga T.", location: "Ajah, Lagos",    rating: 5, text: "This one has survived 3 months and still going strong. The surge protection actually works." },
      { name: "Chioma R.", location: "Gbagada, Lagos", rating: 5, text: "Charges my iPhone and MacBook at the same time! Now I only carry one charger." },
      { name: "Ahmed S.",  location: "Apapa, Lagos",   rating: 4, text: "Fast charging is real. My Samsung goes from dead to 80% during my morning routine." },
    ],

    faq: [
      { q: "Is it safe for iPhone?",                    a: "Yes! Supports Apple fast charging (20W), certified safe for all iPhones." },
      { q: "Does it protect against NEPA surges?",      a: "Yes — built-in protection up to 1500W surge capacity." },
      { q: "Can it charge a laptop?",                   a: "Yes — the USB-C port delivers 65W, enough for MacBook Air and Pro." },
      { q: "What's the warranty?",                      a: "6-month warranty. WhatsApp us if it fails and we'll replace it." },
    ],
  },

  {
    id: "bp-monitor",
    cat: "Health",
    bg: "#F8F0E8",
    thumbnail: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
    name: "Digital Blood Pressure Monitor",
    tagline: "Know your numbers. Protect your health.",
    price: 12000,
    originalPrice: 18000,
    badge: "Doctor Rec.",
    badgeColor: "#2A8C52",
    purchases: 432,
    rating: 4.9,
    reviews: 187,
    satisfaction: 99,

    description:
      "Clinical-grade upper-arm BP monitor with large LCD display, 60-reading memory, irregular heartbeat detection, and WHO risk classification. Accurate to ±2mmHg.",

    problem: {
      title: "Hypertension is Nigeria's #1 silent killer.",
      body: "Over 35% of Nigerian adults have high blood pressure and most don't know it. Unmonitored hypertension leads to strokes, kidney failure, and heart attacks.",
    },

    solutions: [
      { icon: "📊", title: "Track daily from home",     body: "Monitor your BP every day. Catch dangerous spikes before they become emergencies." },
      { icon: "⚠️", title: "Irregular heartbeat alert", body: "Automatically detects irregular heartbeat patterns during measurement." },
      { icon: "👨‍👩‍👧", title: "Whole family use",       body: "60-reading memory with 2 user profiles." },
    ],

    features: [
      "Clinical accuracy: ±2mmHg",
      "WHO blood pressure risk colour classification",
      "60-reading memory for 2 users",
      "Irregular heartbeat (IHB) detection",
      "Large backlit LCD — easy to read",
      "Includes adult cuff (22–42cm arm)",
    ],

    images: [
      { src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80", alt: "Digital blood pressure monitor", label: "Device" },
      { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80", alt: "BP monitor LCD display",         label: "Display" },
      { src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",    alt: "Measuring blood pressure",       label: "In Use" },
      { src: "https://images.unsplash.com/photo-1584467735871-8e4a5b43c5f7?w=800&q=80", alt: "BP monitor full kit in box",     label: "Full Kit" },
    ],

    testimonials: [
      { name: "Dr. Mrs. Bello", location: "Ilupeju, Lagos", rating: 5, text: "As a nurse, I'm very particular about accuracy. This matches our hospital equipment." },
      { name: "Chief Adeyemi",  location: "Ikeja, Lagos",   rating: 5, text: "Easy to use, large screen perfect for my eyes. No more daily clinic visits." },
      { name: "Mrs. Obi",       location: "Maryland, Lagos", rating: 5, text: "My mother uses it every morning herself — so easy to operate. Very reliable." },
    ],

    faq: [
      { q: "Is it as accurate as hospital equipment?",    a: "Yes — clinically validated with ±2mmHg accuracy." },
      { q: "Which arm do I use?",                         a: "Always use your left arm. Sit quietly for 5 minutes before measuring." },
      { q: "What batteries does it need?",                a: "4 AA batteries (included). Approximately 300 readings per set." },
      { q: "Can elderly parents use it alone?",           a: "Yes — one-button operation with colour-coded risk levels." },
    ],
  },
];

export const CATEGORIES  = ["All", "Beauty", "Electronics", "Health"];
export const CAT_COLORS  = {
  Beauty:      { bg: "#FAD5C4", text: "#C4714A" },
  Electronics: { bg: "#C4D5FA", text: "#3A5ACC" },
  Health:      { bg: "#C4FAD8", text: "#2A8C52" },
};
export const CAT_EMOJI   = { All:"🛍️", Beauty:"💄", Electronics:"⚡", Health:"🌿" };
export const getProduct  = (id) => PRODUCTS.find(p => p.id === id) || null;
