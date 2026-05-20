
import styles from "../components/PolicyPage.module.css";
import { STORE_NAME, } from "@/lib/constants";
import {WHATSAPP_NUMBER} from "@/lib/constants"
export const metadata = {
  title: `Return & Refund Policy | ${STORE_NAME}`,
  description: "Return and refund policy for MyShop Lagos. Learn how to return products and get your money back.",
};

const TOC = ["Our Return Promise","Items Eligible for Return","Items Not Eligible","How to Initiate a Return","Return Process & Timeline","Refund Policy","Damaged or Wrong Items","Exchange Policy","Frequently Asked Questions","Contact Us"];

function Section({ id, num, title, children }) {
  return (
    <div id={`section-${id}`} className={styles.section}>
      <div className={styles.sectionNum}>{num}</div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

export default function ReturnsPage() {
  return (
    <page badge="↩️ Return Policy" title="Return &amp; <em>Refund Policy</em>" updated="January 1, 2026" toc={TOC}>

      <Section id={1} num="01" title="Our Return Promise">
        <p className={styles.text}>At {STORE_NAME}, your satisfaction is our priority. We stand behind every product we sell. If you are not completely satisfied with your purchase, we offer a straightforward 5-days return window from the date of delivery.</p>
        <div className={styles.highlight}>
          🛡️ <strong>5-Days Return Window</strong> — If you&apos;re not happy with your order for any valid reason, contact us within 5 days of delivery and we will work to make it right. Since all payments are made on delivery, there is no financial risk to you.
        </div>
        <p className={styles.text}>Because we operate on a <strong>Payment on Delivery</strong> model, you have the opportunity to inspect your item before paying. We strongly encourage you to check your order carefully at the point of delivery. If you notice any defects or discrepancies, you may refuse delivery without any payment obligation.</p>
      </Section>

      <Section id={2} num="02" title="Items Eligible for Return">
        <p className={styles.text}>The following situations qualify for a return or replacement:</p>
        <ul className={styles.list}>
          <li><strong>Wrong item delivered</strong> — you received a different product from what you ordered.</li>
          <li><strong>Defective or damaged product</strong> — the item arrived broken, faulty, or not working as described.</li>
          <li><strong>Significantly different from description</strong> — the product materially differs from how it was described or shown on our website.</li>
          <li><strong>Electronics malfunction</strong> — electronics that stop working within 3 days of delivery under normal use conditions.</li>
          <li><strong>Sealed beauty products with quality issues</strong> — unopened products that appear tampered with, smell unusual, or show signs of being counterfeit.</li>
          <li><strong>Health products — wrong item or tampered packaging</strong> — wrong supplement delivered or packaging seal broken upon receipt.</li>
        </ul>
      </Section>

      <Section id={3} num="03" title="Items Not Eligible for Return">
        <p className={styles.text}>The following items <strong>cannot</strong> be returned or refunded:</p>
        <ul className={styles.list}>
          <li>Products that have been used, opened, or consumed (unless faulty).</li>
          <li>Beauty and skincare products that have been opened and used — for hygiene reasons.</li>
          <li>Health supplements that have been opened and partially used.</li>
          <li>Products damaged through misuse, negligence, or accidents after delivery.</li>
          <li>Items returned more than 5 days after delivery.</li>
          <li>Products where the original packaging, accessories, or documentation have been discarded.</li>
          <li>Change of mind returns on personal care or consumable products that have been opened.</li>
        </ul>
        <div className={styles.highlight}>
          Tip: Always inspect your product thoroughly before opening or using it. If you notice anything wrong with a sealed product, contact us on WhatsApp before opening it.
        </div>
      </Section>

      <Section id={4} num="04" title="How to Initiate a Return">
        <p className={styles.text}>Returning a product is simple. Follow these steps:</p>
        <ul className={styles.list}>
          <li><strong>Step 1</strong> — WhatsApp us within 5 days of delivery. Send your name, order details, and clearly state the issue.</li>
          <li><strong>Step 2</strong> — Send a short video or photos showing the problem with the product. This helps us process your return quickly.</li>
          <li><strong>Step 3</strong> — We will review your request within 24 hours (on business days) and confirm whether the return is approved.</li>
          <li><strong>Step 4</strong> — If approved, we will arrange pickup from your delivery address at no cost to you, or provide instructions for dropping it off.</li>
          <li><strong>Step 5</strong> — Once we receive and inspect the returned item, we will arrange a replacement or refund as applicable.</li>
        </ul>
        <p className={styles.text}>Do not return any product without first getting approval from us on WhatsApp. Unapproved returns may not be accepted.</p>
      </Section>

      <Section id={5} num="05" title="Return Process & Timeline">
        <ul className={styles.list}>
          <li><strong>Return request review</strong> — within 24 hours of your WhatsApp message (business days).</li>
          <li><strong>Return pickup/drop-off</strong> — arranged within 2–3 business days after approval.</li>
          <li><strong>Product inspection</strong> — within 1–2 business days after we receive the item.</li>
          <li><strong>Replacement dispatch</strong> — within 2–3 business days after inspection (if replacement is chosen).</li>
          <li><strong>Refund processing</strong> — within 3–5 business days after inspection (if refund is applicable).</li>
        </ul>
      </Section>

      <Section id={6} num="06" title="Refund Policy">
        <p className={styles.text}>Since all payments are made in cash on delivery, refunds are processed as follows:</p>
        <ul className={styles.list}>
          <li><strong>Cash refund</strong> — a refund agent will deliver your cash refund to your address within 3–5 business days after the return is approved and the item inspected.</li>
          <li><strong>Bank transfer</strong> — if you prefer, we can transfer the refund amount to your Nigerian bank account. Please provide your account details via WhatsApp.</li>
          <li>Refunds are for the exact amount paid. We do not charge restocking or handling fees on eligible returns.</li>
          <li>Original delivery fees (if any) are non-refundable unless the return is due to our error.</li>
        </ul>
        <div className={styles.highlight}>
          Refunds are only issued after the returned item has been received and inspected by our team. We will update you on WhatsApp at each stage of the process.
        </div>
      </Section>

      <Section id={7} num="07" title="Damaged or Wrong Items">
        <p className={styles.text}>If your order arrives damaged or if you received the wrong item, we sincerely apologise. Here is what to do:</p>
        <ul className={styles.list}>
          <li><strong>At the point of delivery</strong> — if the package looks visibly damaged, you may refuse delivery. You will owe nothing.</li>
          <li><strong>After delivery</strong> — if you discover damage or a wrong item after opening, take clear photos or a short video immediately, then WhatsApp us within 48 hours.</li>
          <li>We will arrange a free return pickup and send you the correct item or a full refund at no extra cost.</li>
          <li>Do not dispose of any damaged packaging or product before contacting us — we may need it for our records.</li>
        </ul>
      </Section>

      <Section id={8} num="08" title="Exchange Policy">
        <p className={styles.text}>If you would like to exchange an eligible product for a different size, variant, or a different product entirely, we can accommodate this subject to availability.</p>
        <ul className={styles.list}>
          <li>Exchanges follow the same process as returns — initiate via WhatsApp within 14 days of delivery.</li>
          <li>If the replacement item has a different price, you will either pay the difference on delivery or receive a partial cash refund.</li>
          <li>Exchanges are subject to stock availability. We will confirm availability on WhatsApp before processing.</li>
        </ul>
      </Section>

      <Section id={9} num="09" title="Frequently Asked Questions">
        {[
          { q:"I paid on delivery and the product is faulty. How do I get my money back?", a:"WhatsApp us with your name, order details, and photos of the faulty product within 14 days. Once we confirm the issue and arrange return pickup, your cash refund will be delivered to your address or sent via bank transfer within 3–5 business days." },
          { q:"I refused delivery because the package was damaged. What happens next?", a:"If you refuse delivery, no payment is taken. WhatsApp us to let us know, and we will arrange to send a replacement or cancel the order — whichever you prefer." },
          { q:"Can I return a beauty product I've already opened?", a:"Opened beauty products cannot be returned for hygiene reasons, unless the product was faulty, smelled unusual, or was clearly not genuine. If you suspect a quality issue, contact us before opening the product." },
          { q:"What if my electronics stops working after a few weeks?", a:"Electronics are covered for 30 days against manufacturing defects under normal use. WhatsApp us with a description of the issue and we will arrange a return and replacement." },
          { q:"How long do I have to request a return?", a:"You have 14 days from your delivery date to request a return. Requests made after 14 days may still be considered on a case-by-case basis, particularly for electronics within their warranty period." },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < 4 ? "1px solid rgba(196,113,74,0.08)" : "none" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--brown)", marginBottom: 8, lineHeight: 1.4 }}>Q: {f.q}</p>
            <p style={{ fontSize: 14, color: "var(--text-m)", lineHeight: 1.7 }}>A: {f.a}</p>
          </div>
        ))}
      </Section>

      <Section id={10} num="10" title="Contact Us">
        <p className={styles.text}>For all return and refund requests, or any questions about this policy, please contact us on WhatsApp. We are committed to resolving every issue promptly and fairly.</p>
        <ul className={styles.list}>
          <li>WhatsApp: Our primary contact — fastest response, usually within 30 minutes.</li>
          <li>Available: Monday to Saturday, 8:00am – 7:00pm.</li>
          <li>Location: Lagos, Nigeria.</li>
        </ul>
        <p className={styles.text}>When contacting us about a return, please have ready: your full name, the product name, date of delivery, and photos or video of the issue. This helps us resolve your case as quickly as possible.</p>
      </Section>

    </page>
  );
}
