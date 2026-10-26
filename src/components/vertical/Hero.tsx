import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import styles from "./vertical.module.css";

type Props = {
  badge: { tag: string; text: string };
  title: ReactNode;
  titleSize?: "lg" | "md";
  intro: ReactNode;
  longIntro?: boolean;
  actions: ReactNode;
  checks?: string[];
  media: ReactNode;
};

export function Hero({ badge, title, titleSize = "lg", intro, longIntro, actions, checks, media }: Props) {
  return (
    <section className={`section ${styles.hero}`}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.badge}>
            <span>{badge.tag}</span>
            {badge.text}
          </p>
          <h1 className={`${styles.h1} ${titleSize === "md" ? styles.h1Sm : ""}`}>{title}</h1>
          <p className={`${styles.heroText} ${longIntro ? styles.heroTextLong : ""}`}>{intro}</p>
          <div className={styles.ctaRow}>{actions}</div>
          {checks && (
            <ul className={styles.heroChecks}>
              {checks.map((c) => (
                <li key={c}>
                  <span className={styles.check} aria-hidden="true">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.heroMedia}>{media}</div>
      </div>
    </section>
  );
}

export function HeroPhoto({ src, alt, aspect, position }: { src: string; alt: string; aspect: string; position: string }) {
  return (
    <div className={styles.heroPhoto} style={{ aspectRatio: aspect }}>
      <Image
        src={src}
        alt={alt}
        fill
        preload
        sizes="(max-width: 900px) 100vw, 560px"
        style={{ objectPosition: position } as CSSProperties}
      />
    </div>
  );
}
