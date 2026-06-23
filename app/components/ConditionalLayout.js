
"use client";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import FacebookPixel from "./FacebookPixel";


export default function ConditionalLayout({ children }) {
  const pathname  = usePathname();
  const isAdmin   = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages: render children only — admin has its own.S layout
    return <>{children}</>;
  }

  return (
    <>
    <FacebookPixel />
      <Nav />
      <main>{children}</main>
      <Footer />  <FacebookPixel />
      <a
        className="float-wa"
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
    </>
  );
}
