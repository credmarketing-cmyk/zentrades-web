"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import type { Feature } from "@/content/home";
import { featureLinks } from "@/lib/links";
import styles from "./home.module.css";

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");

export function FeatureTabs({ groups }: { groups: { label: string; items: Feature[] }[] }) {
  const flat = groups.flatMap((g) => g.items);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const cur = flat[active];
  let k = 0;

  return (
    <div className={styles.featLayout}>
      <div className={styles.featList} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {groups.map((g) => (
          <div key={g.label}>
            <p className={`mono ${styles.featGroupLabel}`}>{g.label}</p>
            {g.items.map((f) => {
              const idx = k++;
              const on = idx === active;
              return (
                <div key={f.name} className={styles.featItem} data-active={on}>
                  <h3>
                    <button type="button" className={styles.featBtn} aria-expanded={on} onClick={() => setActive(idx)}>
                      {f.name}
                      <span aria-hidden="true">→</span>
                    </button>
                  </h3>
                  <div className={styles.featDesc}>
                    <p>{f.desc}</p>
                    <Link href={f.href}>Learn more about {f.name}</Link>
                    <div className={styles.featProgress} data-paused={paused}>
                      {on && <div key={active} onAnimationEnd={() => setActive((a) => (a + 1) % flat.length)} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.featPreview}>
        <div className={styles.browser}>
          <div className={styles.browserBar}>
            <div className={styles.dots} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={`mono ${styles.url}`}>app.zentrades.pro/{slug(cur.name)}</div>
            <div className={styles.live}>
              <span className={styles.liveDot} />
              Live
            </div>
          </div>
          <div className={styles.screen}>
            {flat.map((f, i) => (
              <Image
                key={f.name}
                src={f.img}
                alt={`ZenTrades ${f.name} screen`}
                fill
                sizes="(max-width: 900px) 100vw, 760px"
                data-active={i === active}
              />
            ))}
          </div>
        </div>
        <div className={styles.featMeta}>
          <div>
            <strong>{String(active + 1).padStart(2, "0")} / {String(flat.length).padStart(2, "0")}</strong> · {cur.tag}
          </div>
          <ButtonLink href={featureLinks.all} variant="light" arrow>
            Explore all features
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
