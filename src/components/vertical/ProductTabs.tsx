"use client";

import Image from "next/image";
import { useId, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import type { ProductTab } from "@/content/verticals/types";
import styles from "./vertical.module.css";

type Props = {
  tabs: ProductTab[];
  heading: ReactNode;
  // "full": heading above, tab bar spans the width (ZenHVAC / ZenPlumbing).
  // "stacked": tab bar directly under the heading (ZenElectrical).
  // "inline": heading left, tab bar right (Elevator / Water).
  layout: "full" | "stacked" | "inline";
};

// Every panel is rendered into the HTML (inactive ones are `hidden`) so all tab copy is crawlable.
export function ProductTabs({ tabs, heading, layout }: Props) {
  const [active, setActive] = useState(0);
  const id = useId();

  const bar = (
    <div role="tablist" aria-label="Product features" className={`${styles.tabBar} ${layout === "full" ? styles.tabBarFull : ""}`}>
      {tabs.map((t, i) => (
        <button
          key={t.label}
          type="button"
          role="tab"
          id={`${id}-tab-${i}`}
          aria-selected={i === active}
          aria-controls={`${id}-panel-${i}`}
          tabIndex={i === active ? 0 : -1}
          className={styles.tab}
          onClick={() => setActive(i)}
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const next = (active + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
            setActive(next);
            document.getElementById(`${id}-tab-${next}`)?.focus();
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {layout === "full" ? (
        <>
          {heading}
          {bar}
        </>
      ) : (
        <div className={layout === "inline" ? styles.tabsHeadInline : styles.tabsHeadStacked}>
          {heading}
          {bar}
        </div>
      )}
      {tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          className={styles.tabPanel}
        >
          <div className={styles.tabShot}>
            <div className={styles.tabShotInner}>
              <Image src={t.img} alt={`${t.label} screen in ZenTrades`} fill sizes="(max-width: 900px) 100vw, 700px" />
            </div>
          </div>
          <div className={styles.tabCopy}>
            <div className={styles.tabLabel}>{t.label}</div>
            <h3 className={styles.tabTitle}>{t.title}</h3>
            <ul className={styles.points}>
              {t.points.map((p) => (
                <li key={p}>
                  <span className={styles.check} aria-hidden="true">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            {t.desc && <p className={styles.tabDesc}>{t.desc}</p>}
            <ButtonLink href={t.link.href} variant="underline" className={styles.tabLink}>
              {t.link.label} →
            </ButtonLink>
          </div>
        </div>
      ))}
    </>
  );
}
