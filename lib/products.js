
// ─── CONFIGURATION ──────────────────────────────────────────────
export const WHATSAPP_NUMBER = "2347067584692"; // ← Your WhatsApp number
export const STORE_NAME      = "BuyRem";
export const STORE_TAGLINE   = "Beauty · Electronics · Health";
export const STORE_LOCATION  = "Lagos, Nigeria";

// ─── PRODUCTS ───────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: "vitamin-c-serum",
    cat: "Beauty",
    emoji: "✨",
    bg: "linear-gradient(135deg,#F7E0D0,#E8B89A)",
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
      body: "Many Nigerian women deal with hyperpigmentation, dark spots from sun exposure, and an uneven skin tone that makes them feel less confident. Most products on the market are either too harsh, too expensive, or simply don't work for our skin type.",
    },

    solutions: [
      { icon: "🌟", title: "Fades dark spots", body: "20% Vitamin C breaks down melanin clusters, visibly reducing dark spots within 2 weeks." },
      { icon: "💧", title: "Deep hydration", body: "Hyaluronic acid locks in moisture all day, leaving skin plump and dewy — not greasy." },
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

    images: [
      { emoji: "✨", bg: "linear-gradient(135deg,#F7E0D0,#E8B89A)", label: "Product Front" },
      { emoji: "🔬", bg: "linear-gradient(135deg,#E8F4E8,#C8E8C8)", label: "Ingredients" },
      { emoji: "💆", bg: "linear-gradient(135deg,#F5D0E0,#E8B0C8)", label: "In Use" },
      { emoji: "📦", bg: "linear-gradient(135deg,#F2D5C4,#E8B89A)", label: "Full Kit" },
    ],

    testimonials: [
      { name: "Amaka O.", location: "Surulere, Lagos", rating: 5, text: "I've tried so many serums. This one actually works! My dark spots have faded so much in just 3 weeks. I get compliments every day now." },
      { name: "Chidinma E.", location: "Ikeja, Lagos", rating: 5, text: "My skin is literally glowing. I was skeptical because of the price but it's worth every naira. Will buy again and again!" },
      { name: "Fatima A.", location: "Lekki, Lagos", rating: 5, text: "Delivery was fast and the product is genuine. No fake smell, very lightweight. Perfect for Lagos weather." },
    ],

    faq: [
      { q: "How soon will I see results?", a: "Most customers notice brighter, more even skin within 7–14 days of consistent use. Full results in 4–6 weeks." },
      { q: "Is it safe for dark skin?", a: "Yes! Our formula is specifically tested for melanin-rich skin tones common across Nigeria. No risk of bleaching." },
      { q: "How do I use it?", a: "Apply 3–4 drops to clean, dry skin every morning before moisturiser and SPF. Avoid eyes." },
      { q: "What if it doesn't work for me?", a: "We offer a full refund within 14 days if you're not satisfied. Just WhatsApp us with your order details." },
    ],
  },

  {
    id: "wireless-earbuds",
    cat: "Electronics",
    emoji: "🎧",
    bg: "linear-gradient(135deg,#1a1a3e,#2d2d5e)",
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
      "Premium Bluetooth 5.0 earbuds with active noise cancellation, 32-hour total battery life, and IPX5 sweat resistance. Crystal-clear calls and powerful bass.",

    problem: {
      title: "Tired of tangled cables and dead earphones?",
      body: "Cheap earphones break within weeks, sound quality is terrible on calls, and the battery dies right when you need it most. You deserve better — especially at Lagos prices.",
    },

    solutions: [
      { icon: "🔊", title: "Studio-quality sound", body: "12mm dynamic drivers deliver powerful bass and crisp highs — like having a concert in your ears." },
      { icon: "🔋", title: "32-hour battery life", body: "8 hours per charge + 24 hours from the charging case. Never run out of music again." },
      { icon: "📞", title: "Crystal-clear calls", body: "4 built-in microphones with AI noise cancellation. People can hear you clearly even in traffic." },
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
      { emoji: "🎧", bg: "linear-gradient(135deg,#1a1a3e,#2d2d5e)", label: "Earbuds" },
      { emoji: "📦", bg: "linear-gradient(135deg,#2d2d5e,#3d3d7e)", label: "With Case" },
      { emoji: "🔋", bg: "linear-gradient(135deg,#001a2d,#002d4a)", label: "Charging" },
      { emoji: "📱", bg: "linear-gradient(135deg,#0a0a1a,#1a1a3e)", label: "Paired" },
    ],

    testimonials: [
      { name: "Emeka N.", location: "Victoria Island, Lagos", rating: 5, text: "Best earbuds I've ever bought in Nigeria. The sound quality is incredible and the ANC actually works on Third Mainland Bridge traffic!" },
      { name: "Tunde B.", location: "Yaba, Lagos", rating: 5, text: "I was expecting Chinese fake quality but this blew me away. Crystal clear on calls, my colleagues keep asking what earphones I'm using." },
      { name: "Blessing K.", location: "Ajah, Lagos", rating: 4, text: "Battery life is amazing. I charge it once on Monday and it lasts all week. Very impressed." },
    ],

    faq: [
      { q: "Does it work with Tecno and Infinix phones?", a: "Yes! It works with any Bluetooth-enabled device — iPhone, Samsung, Tecno, Infinix, Itel and more." },
      { q: "Is the noise cancellation good?", a: "Yes — it reduces background noise by up to 35dB. Great for busy Lagos environments, offices, and commutes." },
      { q: "What if one earbud stops working?", a: "We offer a 3-month warranty. WhatsApp us and we'll replace any faulty unit." },
      { q: "Can I use just one earbud?", a: "Yes, both earbuds work independently. Use one for calls and save the other's battery." },
    ],
  },

  {
    id: "moringa-capsules",
    cat: "Health",
    emoji: "🌿",
    bg: "linear-gradient(135deg,#D4E4CC,#B5C4A8)",
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
      body: "With our busy Lagos lifestyles, poor diet, and stress, many Nigerians suffer from fatigue, low immunity, and nutritional deficiencies — without even knowing it. Most multivitamins are imported, expensive, and full of synthetic chemicals.",
    },

    solutions: [
      { icon: "⚡", title: "Natural energy boost", body: "Moringa contains all 9 essential amino acids and iron — naturally combating fatigue without caffeine." },
      { icon: "🛡️", title: "Immune system support", body: "7x more Vitamin C than oranges. Fights infections and keeps you strong through every season." },
      { icon: "🌱", title: "100% Nigerian & organic", body: "Grown right here in Nigeria without pesticides. Supporting local farmers while nourishing your body." },
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
      { emoji: "🌿", bg: "linear-gradient(135deg,#D4E4CC,#B5C4A8)", label: "Capsules" },
      { emoji: "🌾", bg: "linear-gradient(135deg,#C8E8C8,#A8D0A8)", label: "Moringa Plant" },
      { emoji: "📋", bg: "linear-gradient(135deg,#E8F4E8,#D0E8D0)", label: "Lab Tested" },
      { emoji: "📦", bg: "linear-gradient(135deg,#B5C4A8,#95A888)", label: "Packaging" },
    ],

    testimonials: [
      { name: "Ngozi M.", location: "Ikoyi, Lagos", rating: 5, text: "I started taking these 2 months ago. My energy levels are through the roof! I no longer feel tired after work. Genuinely life-changing." },
      { name: "Pastor Ade F.", location: "Alimosho, Lagos", rating: 5, text: "My doctor recommended moringa and I found this brand. NAFDAC approved, good quality. My blood results have improved significantly." },
      { name: "Mrs. Okonkwo", location: "Surulere, Lagos", rating: 5, text: "Bought for my husband and I. We both feel more energetic and our immune system has been strong this harmattan season." },
    ],

    faq: [
      { q: "Is it NAFDAC approved?", a: "Yes, our moringa capsules are fully NAFDAC approved and registered. We can share the NAFDAC number on request." },
      { q: "Can pregnant women take it?", a: "Yes, moringa is safe for pregnant women and is actually recommended for its iron content. Consult your doctor first." },
      { q: "How long before I see results?", a: "Most people feel more energetic within the first week. Full benefits — stronger immunity and improved health — in 4–6 weeks." },
      { q: "How many capsules per day?", a: "Take 2 capsules daily with water, preferably in the morning with breakfast." },
    ],
  },

  {
    id: "hair-growth-oil",
    cat: "Beauty",
    emoji: "🌸",
    bg: "linear-gradient(135deg,#F5D0E0,#E8B0C8)",
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
      "A powerful blend of castor oil, coconut oil, argan oil, and biotin designed specifically for natural African hair. Reduces breakage, promotes thickness, and nourishes from root to tip.",

    problem: {
      title: "Hair breaking off? Edges thinning? Growth stalled?",
      body: "The Lagos climate, heat styling, chemicals, and stress take a serious toll on African hair. Many women experience thinning edges, breakage, and slow growth — spending money on products that promise results but deliver nothing.",
    },

    solutions: [
      { icon: "🌱", title: "Stimulates growth", body: "Castor oil increases blood circulation to the scalp — directly triggering dormant hair follicles to grow." },
      { icon: "💪", title: "Stops breakage", body: "Biotin and argan oil strengthen each hair strand from within, reducing breakage by up to 80%." },
      { icon: "✨", title: "Restores edges", body: "Regular application to edges and temples shows visible regrowth within 4–6 weeks." },
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
      { emoji: "🌸", bg: "linear-gradient(135deg,#F5D0E0,#E8B0C8)", label: "Product" },
      { emoji: "💧", bg: "linear-gradient(135deg,#E8C8D8,#D0A8C0)", label: "Oil Texture" },
      { emoji: "✨", bg: "linear-gradient(135deg,#F8E8F0,#F0D0E8)", label: "Before/After" },
      { emoji: "📦", bg: "linear-gradient(135deg,#F2D5C4,#E8B89A)", label: "Packaging" },
    ],

    testimonials: [
      { name: "Adaeze I.", location: "Lekki, Lagos", rating: 5, text: "My edges are BACK! After years of thinning from braids, 6 weeks of this oil and people are asking what I'm doing differently. Amazing product!" },
      { name: "Sade L.", location: "Ikeja GRA, Lagos", rating: 5, text: "I've bought expensive oils from abroad. This one from Lagos is honestly better. My hair growth in 2 months has been incredible." },
      { name: "Kemi A.", location: "Magodo, Lagos", rating: 4, text: "The smell is light and pleasant. My hair feels stronger and less is falling out in the shower. Very happy with this purchase." },
    ],

    faq: [
      { q: "How often should I apply?", a: "Apply 2–3 times per week for best results. Massage into scalp for 5 minutes to boost circulation." },
      { q: "Does it work on relaxed hair?", a: "Yes! It works on all hair types — natural, relaxed, loc'd, and transitioning hair." },
      { q: "Will it make my hair greasy?", a: "No — a little goes a long way. Start with a few drops and increase as needed. It absorbs well into the scalp." },
      { q: "When will I see hair growth?", a: "Most customers notice less hair fall within 2 weeks. Visible new growth typically begins in 4–6 weeks." },
    ],
  },

  {
    id: "fast-charger",
    cat: "Electronics",
    emoji: "⚡",
    bg: "linear-gradient(135deg,#1a2d1a,#2d4a2d)",
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
      "Ultra-compact 65W GaN (Gallium Nitride) fast charger with USB-C and USB-A ports. Charges phones, tablets, and laptops simultaneously. NEPA-spike protected.",

    problem: {
      title: "Slow charging, fried phones, and NEPA surges?",
      body: "Cheap chargers in Nigeria damage batteries, cause overheating, and offer zero protection against power surges. With epileptic NEPA supply, the wrong charger can permanently damage your expensive device.",
    },

    solutions: [
      { icon: "⚡", title: "Blazing fast charging", body: "65W GaN technology charges your phone from 0 to 80% in just 35 minutes — 4x faster than standard chargers." },
      { icon: "🛡️", title: "NEPA surge protection", body: "Built-in surge protection and voltage regulation keeps your device safe during power fluctuations." },
      { icon: "📱", title: "Charges everything", body: "USB-C + USB-A ports charge your phone, tablet, earbuds, and laptop simultaneously." },
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
      { emoji: "⚡", bg: "linear-gradient(135deg,#1a2d1a,#2d4a2d)", label: "Charger" },
      { emoji: "🔌", bg: "linear-gradient(135deg,#0d1a0d,#1a2d1a)", label: "Ports" },
      { emoji: "📱", bg: "linear-gradient(135deg,#002d10,#004a20)", label: "In Use" },
      { emoji: "📦", bg: "linear-gradient(135deg,#1a3a1a,#2d5a2d)", label: "Package" },
    ],

    testimonials: [
      { name: "Gbenga T.", location: "Ajah, Lagos", rating: 5, text: "I've gone through 4 chargers this year from NEPA surges. This one has survived 3 months and still going strong. The surge protection actually works." },
      { name: "Chioma R.", location: "Gbagada, Lagos", rating: 5, text: "Charges my iPhone and MacBook at the same time! I didn't believe it until I tried it. Now I only carry one charger everywhere." },
      { name: "Ahmed S.", location: "Apapa, Lagos", rating: 4, text: "Fast charging is real. My Samsung Galaxy goes from dead to 80% during my morning routine. Very impressed." },
    ],

    faq: [
      { q: "Is it safe for iPhone?", a: "Yes! It supports Apple fast charging (20W) and is certified safe for all iPhone models." },
      { q: "Does it really protect against NEPA surges?", a: "Yes — it has built-in protection up to 1500W surge capacity. Much safer than standard chargers." },
      { q: "Can it charge a laptop?", a: "Yes — the USB-C port delivers 65W which is enough to charge most laptops including MacBook Air and Pro." },
      { q: "What's the warranty?", a: "6-month warranty. If it fails within 6 months, WhatsApp us and we'll replace it." },
    ],
  },

  {
    id: "bp-monitor",
    cat: "Health",
    emoji: "🩺",
    bg: "linear-gradient(135deg,#F8F0E8,#F0D8C0)",
    name: "Digital Blood Pressure Monitor",
    tagline: "Know your numbers. Protect your health.",
    price: 12000,
    originalPrice: 18000,
    badge: "Doctor Recommended",
    badgeColor: "#2A8C52",
    purchases: 432,
    rating: 4.9,
    reviews: 187,
    satisfaction: 99,

    description:
      "Clinical-grade upper-arm BP monitor with large LCD display, 60-reading memory, irregular heartbeat detection, and WHO risk classification. Accurate to ±2mmHg.",

    problem: {
      title: "Hypertension is the #1 silent killer in Nigeria.",
      body: "Over 35% of Nigerian adults have high blood pressure — and most don't know it. Visiting a clinic every time you need a BP reading is expensive and inconvenient. Unmonitored hypertension leads to strokes, kidney failure, and heart attacks.",
    },

    solutions: [
      { icon: "📊", title: "Track daily from home", body: "Monitor your BP every day in the comfort of your home. Catch dangerous spikes before they become emergencies." },
      { icon: "⚠️", title: "Irregular heartbeat alert", body: "Automatically detects and alerts you to irregular heartbeat patterns during measurement." },
      { icon: "👨‍👩‍👧", title: "Whole family use", body: "60-reading memory with 2 user profiles. Track BP for you and a family member separately." },
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
      { emoji: "🩺", bg: "linear-gradient(135deg,#F8F0E8,#F0D8C0)", label: "Device" },
      { emoji: "📊", bg: "linear-gradient(135deg,#F0E8D8,#E8D0B0)", label: "Display" },
      { emoji: "💪", bg: "linear-gradient(135deg,#F8E8D8,#F0D0B8)", label: "In Use" },
      { emoji: "📦", bg: "linear-gradient(135deg,#F2D5C4,#E8C0A0)", label: "Full Kit" },
    ],

    testimonials: [
      { name: "Dr. Mrs. Bello", location: "Ilupeju, Lagos", rating: 5, text: "As a nurse, I'm very particular about accuracy. This monitor is within 2mmHg of our hospital equipment. Excellent for home monitoring." },
      { name: "Chief Adeyemi", location: "Ikeja, Lagos", rating: 5, text: "My doctor told me to monitor daily. This is accurate, easy to use, and the large screen is perfect for my eyes. No more daily clinic visits." },
      { name: "Mrs. Obi", location: "Maryland, Lagos", rating: 5, text: "Bought for my mother who has hypertension. She uses it every morning herself — so easy to operate. Very reliable readings." },
    ],

    faq: [
      { q: "Is it as accurate as hospital equipment?", a: "Yes — it's clinically validated with an accuracy of ±2mmHg, matching most hospital-grade devices." },
      { q: "Which arm do I use?", a: "Always use your left arm for most accurate results. Sit quietly for 5 minutes before measuring." },
      { q: "What batteries does it need?", a: "4 AA batteries (included). Battery life is approximately 300 readings." },
      { q: "Can my elderly parent use it alone?", a: "Yes — it has a large one-button operation and auto-displays results with colour-coded risk levels." },
    ],
  },
];

export const CATEGORIES = ["All", "Beauty", "Electronics", "Health"];

export const CAT_COLORS = {
  Beauty:      { bg: "#FAD5C4", text: "#C4714A" },
  Electronics: { bg: "#C4D5FA", text: "#3A5ACC" },
  Health:      { bg: "#C4FAD8", text: "#2A8C52" },
};

export const CAT_EMOJI = {
  All: "🛍️", Beauty: "💄", Electronics: "⚡", Health: "🌿",
};

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}
