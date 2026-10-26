"use client";

import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import type { Feature } from "@/content/verticals/types";
import styles from "./FeatureBrowser.module.css";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");

// "Why ZenTrades fits" list: hovering a feature swaps the app screenshot.
export function FeatureBrowser({ items, theme, ctaHref }: { items: (Feature & { img: string })[]; theme: "light" | "dark"; ctaHref: string }) {
  const [active, setActive] = useState(0);
  const cur = items[active];

  return (
    <div className={styles.layout} data-theme={theme}>
      <div className={styles.preview}>
        <div className={styles.browser}>
          <div className={styles.bar}>
            <div className={styles.dots} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={`mono ${styles.url}`}>app.zentrades.pro/{slug(cur.title)}</div>
            <div className={styles.live}>
              <span />
              Live
            </div>
          </div>
          <div className={styles.screen}>
            {items.map((f, i) => (
              <Image
                key={f.title}
                src={f.img}
                alt={`${f.title} in ZenTrades`}
                fill
                sizes="(max-width: 900px) 100vw, 640px"
                data-active={i === active}
              />
            ))}
          </div>
        </div>
        <div className={styles.meta}>
          <div>
            <strong>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</strong> · {cur.title}
          </div>
          <ButtonLink href={ctaHref} variant={theme === "dark" ? "light" : "dark"} arrow className={styles.cta}>
            Book a demo
          </ButtonLink>
        </div>
      </div>

      <ul className={styles.list}>
        {items.map((f, i) => (
          <li key={f.title} className={styles.row} data-active={i === active} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}>
            <span className={`mono ${styles.num}`}>{String(i + 1).padStart(2, "0")}</span>
            <div className={styles.text}>
              <h3 className={styles.title}>
                <button type="button" aria-pressed={i === active} onFocus={() => setActive(i)}>
                  {f.title}
                </button>
              </h3>
              <p className={styles.desc}>{f.desc}</p>
            </div>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
