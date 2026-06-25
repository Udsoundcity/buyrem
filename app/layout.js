import Script from "next/script";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";
import { getSettings } from "@/lib/settings";




export const metadata = {
  title:       `${STORE_NAME} — Beauty, Electronics & Health | Lagos`,
  description: `Shop ${STORE_TAGLINE}. Order via WhatsApp, pay cash on delivery.`,
};

export default async function RootLayout({ children }) {
  // Load pixel code from settings (Supabase or local file)
  let pixelCode = "";
  try {
    const settings = await getSettings();
    pixelCode = settings?.metaPixel || "";
  } catch { /* fail silently — pixel is optional */ }

  // Extract pixel ID for noscript fallback
  const pixelIdMatch = pixelCode.match(/fbq\('init',\s*['"](\d+)['"]/);
  const pixelId      = pixelIdMatch?.[1] || null;

  return (
    <html lang="en">
      <head>
        {/* Fonts: DM Serif Display + Plus Jakarta Sans + Syne (landing page headlines) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
       
        <ConditionalLayout>{children}</ConditionalLayout> 

        {/* ── Meta Pixel — injected from admin settings ── */}
        <FacebookPixel />
      </body>
    </html>
  );
}
