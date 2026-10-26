import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./TrustMarquee.module.css";

const logos = [
  { src: "/images/trust-groundstate.png", alt: "Groundstate" },
  { src: "/images/trust-mechanical.png", alt: "Mechanical" },
  { src: "/images/trust-roberts.png", alt: "Roberts" },
  { src: "/images/trust-strategic.png", alt: "Strategic" },
  { src: "/images/trust-everest.png", alt: "Everest" },
  { src: "/images/trust-harmony.png", alt: "Harmony" },
];

export function TrustMarquee({ title }: { title: ReactNode }) {
  return (
    <section className={styles.trust} aria-labelledby="trust-title">
      <h2 id="trust-title" className={styles.title}>
        <span>{title}</span>
      </h2>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {[...logos, ...logos].map((l, i) => (
            <Image
              key={i}
              src={l.src}
              alt={i < logos.length ? l.alt : ""}
              aria-hidden={i >= logos.length || undefined}
              width={140}
              height={48}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
