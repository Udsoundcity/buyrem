import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { STORE_NAME, STORE_TAGLINE, WHATSAPP_NUMBER } from "../lib/products";

export const metadata = {
  title: `${STORE_NAME} — Beauty, Electronics & Health | Lagos`,
  description: `Shop beauty, electronics, and health products. Order via WhatsApp, pay cash on delivery. Free delivery within Lagos, Nigeria.`,
  keywords: "online shop nigeria, beauty products lagos, electronics lagos, health products, payment on delivery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
         <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        {/* Sticky Nav — defined here so it appears on every page */}
        <Nav />

        {/* Page content */}
        <main>{children}</main>

        {/* Footer — defined here so it appears on every page */}
        <Footer />

        {/* Global floating WhatsApp button */}
        <a
          className="float-wa"
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          title="Chat on WhatsApp"
        >
          <i class="fa-brands fa-whatsapp"></i>
        </a>
      </body>
    </html>
  );
}
