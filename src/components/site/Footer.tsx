import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/lib/brands";
import { footerColumns } from "@/lib/links";
import { NewsletterForm } from "./NewsletterForm";
import styles from "./Footer.module.css";

export function Footer({ brand }: { brand: Brand }) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.newsletter}>
          <p className={styles.newsletterTitle}>
            Field service updates,
            <br />
            in your inbox.
          </p>
          <NewsletterForm />
        </div>

        <div className={styles.grid}>
          {footerColumns.map((c) => (
            <div key={c.title}>
              <h2 className={`mono ${styles.colTitle}`}>{c.title}</h2>
              <ul className={styles.links}>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <address className={styles.contact}>
            <span className="stars">★★★★★</span>
            <strong>Recognized by field service businesses nationwide</strong>
            <span>236 W 27th St, Floor 12, New York, NY 10001</span>
            <span>A-302, Nyati Tech Park, Kalyani Nagar, Pune 411014</span>
            <a href="tel:+12064568988">(206) 456-8988</a>
            <a href="mailto:hello@zentrades.pro">hello@zentrades.pro</a>
          </address>
        </div>

        <Image
          src={brand.logoWhite.src}
          width={brand.logoWhite.width}
          height={brand.logoWhite.height}
          alt=""
          sizes="(max-width: 1248px) 100vw, 1200px"
          className={styles.wordmark}
        />

        <div className={styles.bottom}>
          <span>© 2026 ZenTrades Inc. All rights reserved.</span>
          <div className={styles.legal}>
            {/* TODO: point to the real privacy policy and terms pages */}
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
