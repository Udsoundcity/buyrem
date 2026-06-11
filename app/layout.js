import script from "next/script";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata = {
  title: `${STORE_NAME} — Beauty, Electronics & Health | Lagos`,
  description: `Shop ${STORE_TAGLINE}. Order via WhatsApp, pay cash on delivery.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
         <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

<Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1337290678502790');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>

        <noscript>
    <img
      height="1"
      width="1"
      style={{ display: "none" }}
      src="https://www.facebook.com/tr?id=1337290678502790&ev=PageView&noscript=1"
      alt=""
    />
  </noscript>
        <SpeedInsights/>
        <ConditionalLayout>{children}</ConditionalLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}
