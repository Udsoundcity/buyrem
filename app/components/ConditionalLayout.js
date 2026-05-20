
"use client";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function ConditionalLayout({ children }) {
  const pathname  = usePathname();
  const isAdmin   = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages: render children only — admin has its own layout
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <a
        className="float-wa"
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
      >
        <i class="fa-brands fa-whatsapp"></i>
      </a>
    </>
  );
}
