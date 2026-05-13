
import styles from "../components/PolicyPage.module.css";
import { STORE_NAME } from "@/lib/products";

export const metadata = {
  title: `Terms & Conditions | ${STORE_NAME}`,
  description: "Terms and conditions for shopping at MyShop Lagos.",
};

const TOC = ["Acceptance of Terms","Our Products","Placing an Order","Pricing & Payment","Delivery & Shipping","Order Cancellation","Limitation of Liability","Governing Law","Changes to Terms","Contact Us"];

function Section({ id, num, title, children }) {
  return (
    <div id={`section-${id}`} className={styles.section}>
      <div className={styles.sectionNum}>{num}</div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

export default function TermsPage() {
  return (
    <page badge="📋 Legal Document" title="Terms &amp; <em>Conditions</em>" updated="January 1, 2026" toc={TOC}>

      <Section id={1} num="01" title="Acceptance of Terms">
        <p className={styles.text}>By accessing our website or placing an order with {STORE_NAME}, you agree to be bound by these Terms and Conditions. Please read them carefully before making a purchase. If you do not agree, please do not proceed with your order.</p>
        <p className={styles.text}>These terms apply to all transactions conducted through our website, WhatsApp ordering system, and any other channels operated by {STORE_NAME} (Lagos, Nigeria).</p>
        <div className={styles.highlight}>By placing an order — through our website form or directly via WhatsApp — you confirm that you have read, understood, and accepted these Terms and Conditions.</div>
      </Section>

      <Section id={2} num="02" title="Our Products">
        <p className={styles.text}>{STORE_NAME} sells beauty, electronics, and health products to customers in Lagos, Nigeria. We take great care to ensure all products are genuine, high quality, and accurately described.</p>
        <ul className={styles.list}>
          <li>All product images, descriptions, and prices are as accurate as possible at the time of listing.</li>
          <li>We reserve the right to update, withdraw, or change product listings at any time without prior notice.</li>
          <li>Product availability is subject to stock levels. We will notify you via WhatsApp if an item is out of stock.</li>
          <li>We do not sell counterfeit, expired, or unsafe products. All products are sourced from verified suppliers.</li>
        </ul>
      </Section>

      <Section id={3} num="03" title="Placing an Order">
        <p className={styles.text}>Orders are placed by completing our online order form, which sends your details to our WhatsApp for confirmation. An order is only confirmed once you receive a WhatsApp confirmation from us.</p>
        <ul className={styles.list}>
          <li>You must provide accurate personal information including your name, phone number, and delivery address.</li>
          <li>You must be 18 years or older to place an order.</li>
          <li>We reserve the right to refuse or cancel any order at our discretion.</li>
          <li>Providing false delivery information may result in additional charges or order cancellation.</li>
        </ul>
      </Section>

      <Section id={4} num="04" title="Pricing & Payment">
        <p className={styles.text}>All prices are displayed in Nigerian Naira (₦). Prices may change without notice, but once your order is confirmed at a given price, that price will not change.</p>
        <ul className={styles.list}>
          <li><strong>Payment on Delivery only</strong> — we do not accept online or upfront payments at this time.</li>
          <li>Payment is made in cash to the delivery person at the point of delivery.</li>
          <li>We do not accept cheques, mobile transfers, or any advance payment method.</li>
        </ul>
        <div className={styles.highlight}>We will NEVER ask for upfront payment or bank transfer before delivery. If anyone claiming to be {STORE_NAME} requests advance payment, please report it to us immediately via WhatsApp.</div>
      </Section>

      <Section id={5} num="05" title="Delivery & Shipping">
        <p className={styles.text}>We currently deliver within Lagos State only. Delivery timelines are estimates and may vary based on location and order volume.</p>
        <ul className={styles.list}>
          <li>Standard delivery: 1–3 business days.</li>
          <li>Same-day delivery available for certain areas — confirm via WhatsApp.</li>
          <li>Delivery is free for all orders within Lagos.</li>
          <li>We are not liable for delays caused by factors outside our control (flooding, protests, public holidays, etc.).</li>
          <li>If you are unavailable at the time of delivery, we will attempt redelivery once before cancelling the order.</li>
        </ul>
      </Section>

      <Section id={6} num="06" title="Order Cancellation">
        <p className={styles.text}>You may cancel your order at any time before it is dispatched by messaging us on WhatsApp. Once dispatched, cancellation is not possible — you will need to follow our Return Policy instead.</p>
        <ul className={styles.list}>
          <li>To cancel, WhatsApp us with your name, order details, and reason for cancellation.</li>
          <li>We may cancel orders if stock is unavailable, delivery address is unserviceable, or we suspect fraud.</li>
          <li>Repeated cancellations or refusals to accept delivery may result in us declining future orders.</li>
        </ul>
      </Section>

      <Section id={7} num="07" title="Limitation of Liability">
        <p className={styles.text}>{STORE_NAME}&apos;s liability is limited to the value of the product purchased. We are not liable for indirect, incidental, or consequential damages.</p>
        <ul className={styles.list}>
          <li>We are not responsible for allergic reactions or adverse effects from beauty or health products — please read product labels and consult a professional if needed.</li>
          <li>Health products are not intended to diagnose, treat, cure, or prevent any disease.</li>
          <li>Electronics carry manufacturer-level warranties and limitations on liability.</li>
        </ul>
      </Section>

      <Section id={8} num="08" title="Governing Law">
        <p className={styles.text}>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the jurisdiction of the courts of Lagos State, Nigeria.</p>
      </Section>

      <Section id={9} num="09" title="Changes to Terms">
        <p className={styles.text}>We reserve the right to update these Terms at any time. The &quot;Last Updated&quot; date at the top reflects the most recent revision. Continued use of our services after changes constitutes acceptance of the updated terms.</p>
      </Section>

      <Section id={10} num="10" title="Contact Us">
        <p className={styles.text}>If you have questions about these terms or your order, reach us via WhatsApp. We&apos;re available Monday to Saturday, 8am–7pm.</p>
        <ul className={styles.list}>
          <li>WhatsApp: Our primary and fastest contact channel.</li>
          <li>Location: Lagos, Nigeria.</li>
          <li>Hours: Monday to Saturday, 8:00am – 7:00pm.</li>
        </ul>
      </Section>

    </page>
  );
}
