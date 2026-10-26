"use client";

import styles from "./Footer.module.css";

// TODO: connect to the email platform (HubSpot / Klaviyo). Submissions are not sent anywhere yet.
export function NewsletterForm() {
  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="newsletter-email" className="visually-hidden">
        Email address
      </label>
      <input id="newsletter-email" type="email" name="email" required placeholder="you@company.com" autoComplete="email" />
      <button type="submit">Subscribe</button>
    </form>
  );
}
