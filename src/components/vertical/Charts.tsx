"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Charts.module.css";

// Bars grow once the chart scrolls into view.
function useGrown<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, grown] as const;
}

const delay = (i: number, step: number) => ({ transitionDelay: `${i * step}s` });

/** 12 bars: first half "before", second half "after" (ZenHVAC). */
export function BeforeAfterChart({ title, brand, values }: { title: string; brand: string; values: number[] }) {
  const [ref, grown] = useGrown<HTMLDivElement>();
  const half = values.length / 2;
  return (
    <figure ref={ref} className={styles.card}>
      <div className={styles.head}>
        <figcaption className={styles.title}>{title}</figcaption>
        <div className={styles.legend} aria-hidden="true">
          <span><i className={styles.before} />Before</span>
          <span><i className={styles.after} />After</span>
        </div>
      </div>
      <div className={styles.bars} style={{ height: 300 }} aria-hidden="true">
        {values.map((v, i) => (
          <div key={i} className={styles.col}>
            <div
              className={`${styles.bar} ${i < half ? styles.before : styles.after}`}
              style={{ height: grown ? `${v}%` : "0%", ...delay(i, 0.06) }}
            />
          </div>
        ))}
      </div>
      <div className={styles.split}>
        <div>Before {brand}</div>
        <div className={styles.splitAfter}>After {brand}</div>
      </div>
    </figure>
  );
}

/** A few labelled bars with values; hovering highlights one (ZenPlumbing case study). */
export function ValueChart({ title, subtitle, bars }: { title: string; subtitle: string; bars: { label: string; value: string; height: number }[] }) {
  const [ref, grown] = useGrown<HTMLDivElement>();
  const [on, setOn] = useState(bars.length - 1);
  return (
    <figure ref={ref} className={styles.card}>
      <figcaption>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </figcaption>
      <div className={`${styles.bars} ${styles.wide}`} style={{ height: 320 }}>
        {bars.map((b, i) => (
          <div key={b.label} className={`${styles.col} ${styles.colValue}`} onMouseEnter={() => setOn(i)}>
            <span className={styles.value} data-on={i === on} style={{ opacity: grown ? 1 : 0, transitionDelay: `${0.5 + i * 0.12}s, 0s` }}>
              {b.value}
            </span>
            <div
              className={`${styles.bar} ${styles.barLg} ${i === on ? styles.after : styles.before}`}
              style={{ height: grown ? `${b.height}%` : "0%", ...delay(i, 0.12) }}
            />
          </div>
        ))}
      </div>
      <div className={`${styles.labels} ${styles.wide}`}>
        {bars.map((b) => (
          <div key={b.label}>{b.label}</div>
        ))}
      </div>
    </figure>
  );
}

/** Monthly bars with a switch-over point and a caption that follows the hovered bar (ZenElectrical). */
export function MonthlyChart({ title, brand, values, switchIndex, note }: { title: string; brand: string; values: number[]; switchIndex: number; note: string }) {
  const [ref, grown] = useGrown<HTMLDivElement>();
  const [on, setOn] = useState(values.length - 1);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <figure ref={ref} className={`${styles.card} ${styles.cardSoft}`}>
      <div className={styles.head}>
        <figcaption className={styles.titleSm}>{title}</figcaption>
        <div className={styles.legend} aria-hidden="true">
          <span><i className={styles.before} />Before</span>
          <span><i className={styles.after} />With {brand}</span>
        </div>
      </div>
      <div className={`${styles.bars} ${styles.barsMonthly}`} style={{ height: 280 }} aria-hidden="true">
        {values.map((v, i) => (
          <div key={i} className={`${styles.col} ${styles.colValue}`} onMouseEnter={() => setOn(i)}>
            <div
              className={`${styles.bar} ${i >= switchIndex ? styles.after : styles.before}`}
              data-on={i === on}
              style={{ height: grown ? `${v}%` : "0%", ...delay(i, 0.06) }}
            />
            <span className={`mono ${styles.month}`}>{months[i]}</span>
          </div>
        ))}
      </div>
      <div className={styles.foot}>
        <span>{note}</span>
        <strong>{on >= switchIndex ? `With ${brand}` : `Before ${brand}`}</strong>
      </div>
    </figure>
  );
}
