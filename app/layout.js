import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

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
      </head>
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
