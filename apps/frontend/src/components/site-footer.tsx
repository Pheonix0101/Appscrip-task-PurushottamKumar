import Image from "next/image";
import { NewsletterForm } from "./newsletter-form";

function InstagramIcon() {
  return <svg viewBox="0 0 36 36" aria-hidden="true"><rect x="3" y="3" width="30" height="30" rx="7" fill="#fff" /><rect x="9.5" y="9.5" width="17" height="17" rx="5.5" fill="none" stroke="#000" strokeWidth="2.3" /><circle cx="18" cy="18" r="4.1" fill="none" stroke="#000" strokeWidth="2.3" /><circle cx="24.4" cy="11.7" r="1.5" fill="#000" /></svg>;
}

function LinkedInIcon() {
  return <svg viewBox="0 0 36 36" aria-hidden="true"><rect x="3" y="3" width="30" height="30" rx="3" fill="#fff" /><circle cx="11.1" cy="11.2" r="1.9" fill="#000" /><path fill="#000" d="M9.3 15h3.6v11.5H9.3zm5.9 0h3.5v1.6c.6-1 1.8-1.9 3.6-1.9 3.9 0 4.5 2.5 4.5 5.7v5.1h-3.6v-4.6c0-1.4 0-2.9-1.9-2.9s-2.2 1.4-2.2 2.8v4.7h-3.4z" /></svg>;
}

export function SiteFooter() {
  return <footer className="site-footer" id="about">
    <div className="footer-top">
      <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
        <h2 id="footer-newsletter-title">Be the first to know</h2>
        <p>Sign up for updates from mettā muse.</p>
        <NewsletterForm />
      </section>
      <section className="footer-contact" id="contact" aria-labelledby="footer-contact-title">
        <h2 id="footer-contact-title">Contact us</h2>
        <a href="tel:+442211335360">+44 221 133 5360</a>
        <a href="mailto:customercare@mettamuse.com">customercare@mettamuse.com</a>
        <h2 className="footer-currency-heading">Currency</h2>
        <p className="footer-currency"><span className="footer-flag" aria-label="United States">🇺🇸</span><span aria-hidden="true">◆</span><strong>USD</strong></p>
        <p className="footer-currency-note">Transactions will be completed in Euros and a currency reference is available on hover.</p>
      </section>
    </div>

    <div className="footer-rule" aria-hidden="true" />

    <div className="footer-bottom">
      <div className="footer-link-column">
        <h2 className="footer-brand">mettā muse</h2>
        <span>About Us</span>
        <span>Stories</span>
        <span>Artisans</span>
        <span>Boutiques</span>
        <a href="mailto:customercare@mettamuse.com">Contact Us</a>
        <span>EU Compliances Docs</span>
      </div>
      <div className="footer-link-column">
        <h2>Quick links</h2>
        <span>Orders &amp; Shipping</span>
        <span>Join/Login as a Seller</span>
        <span>Payment &amp; Pricing</span>
        <span>Return &amp; Refunds</span>
        <span>FAQs</span>
        <span>Privacy Policy</span>
        <span>Terms &amp; Conditions</span>
      </div>
      <div className="footer-connect">
        <h2>Follow us</h2>
        <div className="footer-socials" aria-label="Social media">
          <span className="footer-social-icon" role="img" aria-label="Instagram"><InstagramIcon /></span>
          <span className="footer-social-icon" role="img" aria-label="LinkedIn"><LinkedInIcon /></span>
        </div>
        <h2 className="footer-accepts">mettā muse ACCEPTS</h2>
        <div className="footer-payments" role="group" aria-label="Payment methods shown in the design">
          <span className="payment-badge" role="img" aria-label="Google Pay"><Image src="/payments/google-pay.svg" alt="" width={56} height={36} /></span>
          <span className="payment-badge payment-mastercard" role="img" aria-label="Mastercard"><span /><span /></span>
          <span className="payment-badge" role="img" aria-label="PayPal"><Image src="/payments/paypal.png" alt="" width={32} height={32} /></span>
          <span className="payment-badge" role="img" aria-label="American Express"><Image src="/payments/amex.svg" alt="" width={56} height={36} /></span>
          <span className="payment-badge" role="img" aria-label="Apple Pay"><Image src="/payments/apple-pay.png" alt="" width={32} height={32} /></span>
          <span className="payment-badge" role="img" aria-label="OPay"><Image src="/payments/opay.svg" alt="" width={56} height={36} /></span>
        </div>
      </div>
    </div>
    <p className="copyright">© {new Date().getFullYear()} mettā muse. All rights reserved.</p>
  </footer>;
}
