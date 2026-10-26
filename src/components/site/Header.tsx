import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import type { Brand } from "@/lib/brands";
import { APP_LOGIN_URL, BOOK_DEMO, mainNav } from "@/lib/links";
import { MobileNav } from "./MobileNav";
import styles from "./Header.module.css";

export function Header({ brand }: { brand: Brand }) {
  const nav = mainNav(brand.whyLabel);
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={brand.home} className={styles.logo} aria-label={`${brand.name} home`}>
          <Image
            src={brand.logo.src}
            width={brand.logo.width}
            height={brand.logo.height}
            alt={brand.name}
            style={{ height: 18, width: "auto" }}
            preload
          />
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.navList}>
            {nav.map((m) =>
              m.items ? (
                <li key={m.label} className={styles.menu}>
                  <button type="button" className={styles.navItem} aria-haspopup="true">
                    {m.label}
                    <span className={styles.caret} aria-hidden="true">▾</span>
                  </button>
                  <ul className={styles.dropdown}>
                    {m.items.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={styles.dropdownLink}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={m.label}>
                  <Link href={m.href!} className={styles.navItem}>
                    {m.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={APP_LOGIN_URL} className={styles.login}>
            Log in
          </a>
          <ButtonLink href={BOOK_DEMO} arrow className={styles.cta}>
            Book a demo
          </ButtonLink>
          <MobileNav nav={nav} />
        </div>
      </div>
    </header>
  );
}
