import PolicyPage from "../policy/page";
import styles from "../components/PolicyPage.module.css";
import { STORE_NAME } from "@/lib/constants";

export const metadata = {
  title: `Privacy Policy | ${STORE_NAME}`,
  description: "Privacy policy for BuyRem Lagos. Learn how we collect, use, and protect your personal information.",
};

const TOC = ["Information We Collect","How We Use Your Information","WhatsApp Communication","Information Sharing","Data Security","Cookies","Your Rights","Children's Privacy","Third-Party Links","Updates to This Policy","Contact Us"];

function Section({ id, num, title, children }) {
  return (
    <div id={`section-${id}`} className={styles.section}>
      <div className={styles.sectionNum}>{num}</div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <PolicyPage badge="🔒 Privacy Document" title="Privacy Policy" updated="January 1, 2026" toc={TOC}>

      <Section id={1} num="01" title="Information We Collect">
        <p className={styles.text}>When you place an order with {STORE_NAME}, we collect the following personal information through our order form and WhatsApp interaction:</p>
        <ul className={styles.list}>
          <li><strong>Full name</strong> — to address your order and delivery.</li>
          <li><strong>Phone number</strong> — to contact you via WhatsApp for order confirmation and delivery updates.</li>
          <li><strong>Delivery address</strong> — including street, area, and LGA within Lagos to fulfil your delivery.</li>
          <li><strong>Order details</strong> — the products you order, quantity, and any special instructions.</li>
        </ul>
        <p className={styles.text}>We do not collect payment card information, bank account details, or any financial data. All payments are made in cash on delivery.</p>
        <div className={styles.highlight}>We only collect information that is strictly necessary to process and deliver your order. We do not create accounts or store passwords.</div>
      </Section>

      <Section id={2} num="02" title="How We Use Your Information">
        <p className={styles.text}>The personal information you provide is used solely for the following purposes:</p>
        <ul className={styles.list}>
          <li>To confirm and process your order.</li>
          <li>To arrange and coordinate delivery to your specified address.</li>
          <li>To contact you via WhatsApp with order updates, delivery timelines, and confirmations.</li>
          <li>To resolve disputes, handle returns, or address complaints related to your order.</li>
          <li>To improve our service and product offerings based on customer feedback.</li>
        </ul>
        <p className={styles.text}>We do not use your information for automated decision-making or profiling. We do not send unsolicited marketing messages unless you have explicitly opted in.</p>
      </Section>

      <Section id={3} num="03" title="WhatsApp Communication">
        <p className={styles.text}>Our primary channel of communication is WhatsApp. When you use our order form, your order details are sent as a formatted message to our WhatsApp business number. Please be aware of the following:</p>
        <ul className={styles.list}>
          <li>WhatsApp messages are encrypted by WhatsApp&apos;s own end-to-end encryption.</li>
          <li>Your phone number becomes visible to us when you initiate or receive a WhatsApp message.</li>
          <li>We will only use your WhatsApp number for order-related communication.</li>
          <li>We will not add you to group chats or broadcast lists without your explicit permission.</li>
        </ul>
      </Section>

      <Section id={4} num="04" title="Information Sharing">
        <p className={styles.text}>{STORE_NAME} does not sell, rent, trade, or share your personal information with third parties for marketing purposes. We may share limited information only in the following circumstances:</p>
        <ul className={styles.list}>
          <li><strong>Delivery personnel</strong> — your name, phone number, and address are shared with our delivery agent solely to complete your delivery.</li>
          <li><strong>Legal compliance</strong> — we may disclose information if required by Nigerian law, court order, or governmental authority.</li>
          <li><strong>Business protection</strong> — to investigate, prevent, or take action against fraud, illegal activities, or violations of our Terms and Conditions.</li>
        </ul>
        <p className={styles.text}>We do not transfer your data outside Nigeria unless required by law.</p>
      </Section>

      <Section id={5} num="05" title="Data Security">
        <p className={styles.text}>We take reasonable measures to protect your personal information from unauthorised access, disclosure, or misuse. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
        <ul className={styles.list}>
          <li>Order information shared via WhatsApp is protected by WhatsApp&apos;s end-to-end encryption.</li>
          <li>We limit access to your personal data to only those employees or agents who need it to process your order.</li>
          <li>We do not store payment information as all payments are cash-on-delivery.</li>
          <li>If we become aware of a data breach that affects your information, we will notify you via WhatsApp as soon as reasonably possible.</li>
        </ul>
      </Section>

      <Section id={6} num="06" title="Cookies">
        <p className={styles.text}>Our website may use cookies — small text files stored on your device — to improve your browsing experience. Cookies help us understand how visitors use our site and remember preferences.</p>
        <ul className={styles.list}>
          <li>We use session cookies to maintain your browsing session (e.g., filter selections).</li>
          <li>We may use analytics tools to understand traffic patterns. This data is aggregated and not personally identifiable.</li>
          <li>You can disable cookies in your browser settings, though this may affect some features of the site.</li>
        </ul>
        <p className={styles.text}>We do not use cookies for advertising or tracking across other websites.</p>
      </Section>

      <Section id={7} num="07" title="Your Rights">
        <p className={styles.text}>You have the following rights regarding your personal information:</p>
        <ul className={styles.list}>
          <li><strong>Right to access</strong> — you can request a copy of the personal information we hold about you.</li>
          <li><strong>Right to correction</strong> — if your information is inaccurate, you can ask us to correct it.</li>
          <li><strong>Right to deletion</strong> — you can ask us to delete your personal information after your order is complete, subject to legal requirements.</li>
          <li><strong>Right to object</strong> — you can object to us using your information for any purpose beyond order fulfilment.</li>
        </ul>
        <p className={styles.text}>To exercise any of these rights, please contact us via WhatsApp. We will respond to your request within 7 business days.</p>
      </Section>

      <Section id={8} num="08" title="Children's Privacy">
        <p className={styles.text}>Our services are intended for persons aged 18 and above. We do not knowingly collect personal information from children under the age of 18. If we become aware that a child under 18 has provided us with personal information, we will delete that information promptly.</p>
        <p className={styles.text}>If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately via WhatsApp.</p>
      </Section>

      <Section id={9} num="09" title="Third-Party Links">
        <p className={styles.text}>Our website may contain links to third-party websites such as social media platforms. These websites have their own privacy policies, and we are not responsible for their content or practices. We encourage you to review the privacy policy of any third-party site you visit.</p>
      </Section>

      <Section id={10} num="10" title="Updates to This Policy">
        <p className={styles.text}>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The &quot;Last Updated&quot; date at the top of this page reflects the most recent revision. We encourage you to review this page periodically.</p>
      </Section>

      <Section id={11} num="11" title="Contact Us">
        <p className={styles.text}>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us via WhatsApp. We are available Monday to Saturday, 8am–7pm.</p>
        <ul className={styles.list}>
          <li>WhatsApp: Our primary and fastest contact channel.</li>
          <li>Location: Lagos, Nigeria.</li>
          <li>Response time: Within 24 hours on business days.</li>
        </ul>
      </Section>

    </PolicyPage>
  );
}
