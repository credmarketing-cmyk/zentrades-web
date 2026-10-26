"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_LOGIN_URL, type NavMenu } from "@/lib/links";
import styles from "./MobileNav.module.css";

export function MobileNav({ nav }: { nav: NavMenu[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={open ? styles.barsOpen : styles.bars} aria-hidden="true" />
      </button>
      <nav id="mobile-nav" className={styles.panel} data-open={open} aria-label="Mobile">
        {nav.map((m) =>
          m.items ? (
            <details key={m.label} className={styles.group}>
              <summary>{m.label}</summary>
              <ul>
                {m.items.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setOpen(false)}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <Link key={m.label} href={m.href!} className={styles.single} onClick={() => setOpen(false)}>
              {m.label}
            </Link>
          ),
        )}
        <a href={APP_LOGIN_URL} className={styles.single}>
          Log in
        </a>
      </nav>
    </>
  );
}
