# MyShop — Next.js E-Commerce

Nigerian e-commerce site with Beauty, Electronics & Health products.
WhatsApp ordering + Payment on Delivery.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Customise First

**1. Your WhatsApp number** → `lib/products.js` line 2
```js
export const WHATSAPP_NUMBER = "2348012345678"; // ← change this
```

**2. Your store name** → `lib/products.js` line 3
```js
export const STORE_NAME = "MyShop"; // ← change this
```

**3. Your products** → `lib/products.js` — edit the PRODUCTS array.
Each product has: name, price, originalPrice, description, problem,
solutions, features, testimonials, faq, images, stats.

## Pages

| Route | Description |
|---|---|
| `/` | Home — 4 featured products + hero + how to order + contact |
| `/products` | All 6 products with category filter |
| `/products/[id]` | Full product detail page |

## Product Detail Sections (in order)

1. Hero — image, price, rating, order button
2. Statistics — purchases, rating, reviews, satisfaction
3. Problem & Solution
4. Product Features
5. Product Images / Gallery
6. Customer Testimonials
7. Countdown Timer (24hr deal timer)
8. Limited Time Offer CTA
9. FAQ Accordion
10. Final CTA

## File Structure

```
app/
├── layout.js              ← Nav + Footer (global)
├── globals.css
├── page.js                ← Home page
├── page.module.css
├── products/
│   ├── page.js            ← All products
│   └── [id]/
│       └── page.js        ← Product detail
└── components/
    ├── Nav.js / .module.css
    ├── Footer.js / .module.css
    ├── ProductCard.js / .module.css
    └── product-detail/
        ├── ProductHero.js / .module.css
        ├── OrderModal.js / .module.css
        ├── OrderTrigger.js
        ├── CountdownTimer.js / .module.css
        ├── FAQ.js / .module.css
        └── Sections.js / .module.css

lib/
└── products.js  ← All data + config
```

## How Orders Work

1. Customer clicks **Order Now** on any product detail page
2. A form modal collects: name, phone, address, area, quantity, notes
3. On submit → WhatsApp opens with a neatly formatted order message
4. You receive the order, confirm, and arrange delivery
5. Customer pays cash on delivery

## Deploy

```bash
npm run build
npm start
```

Or deploy free on **Vercel**: https://vercel.com — connect your GitHub repo and it deploys automatically.
