import Image from "next/image";

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.2 8.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM3.8 10h2.8v9H3.8v-9Zm5.2 0h2.7v1.2h.1a3 3 0 0 1 2.7-1.5c2.9 0 3.5 1.9 3.5 4.3v5h-2.8v-4.4c0-1.1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3V19H9v-9Z" /></svg>;
}

export function SiteFooter() {
  return <footer className="site-footer" id="about">
    <div className="footer-top">
      <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
        <h2 id="footer-newsletter-title">Be the first to know</h2>
        <p>Sign up for updates from mettā muse.</p>
        <form className="footer-subscribe" aria-label="Newsletter signup">
          <label className="visually-hidden" htmlFor="footer-email">Email address</label>
          <input id="footer-email" type="email" placeholder="Enter your e-mail..." autoComplete="email" disabled />
          <button type="button" disabled title="Newsletter subscriptions are coming soon">Subscribe</button>
        </form>
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
