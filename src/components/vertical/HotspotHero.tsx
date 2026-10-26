"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./HotspotHero.module.css";

type Hotspot = { x: number; y: number; label: string; text: string };

// Illustration with numbered hotspots that auto-rotate until the visitor picks one.
export function HotspotHero({ img, alt, hotspots }: { img: string; alt: string; hotspots: Hotspot[] }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held) return;
    const t = setInterval(() => setActive((a) => (a + 1) % hotspots.length), 3200);
    return () => clearInterval(t);
  }, [held, hotspots.length]);

  const pick = (i: number) => {
    setActive(i);
    setHeld(true);
  };
  const cur = hotspots[active];

  return (
    <div className={styles.stage}>
      <div className={styles.glow} />
      <div className={styles.art}>
        <Image src={img} alt={alt} fill preload sizes="(max-width: 900px) 90vw, 520px" />
        {hotspots.map((h, i) => (
          <button
            key={h.label}
            type="button"
            className={styles.spot}
            data-on={i === active}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            aria-label={`${h.label}: ${h.text}`}
            onMouseEnter={() => pick(i)}
            onClick={() => pick(i)}
          >
            <span className={styles.ring} />
            <span className={styles.dot}>{i + 1}</span>
          </button>
        ))}
      </div>
      <div className={styles.card} aria-live="polite">
        <span className={`mono ${styles.num}`}>{String(active + 1).padStart(2, "0")}</span>
        <div className={styles.copy}>
          <div className={styles.label}>{cur.label}</div>
          <div className={styles.text}>{cur.text}</div>
        </div>
        <div className={styles.pager} aria-hidden="true">
          {hotspots.map((h, i) => (
            <span key={h.label} data-on={i === active} />
          ))}
        </div>
      </div>
    </div>
  );
}
