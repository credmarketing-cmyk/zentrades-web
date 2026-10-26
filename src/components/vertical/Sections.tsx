import Image from "next/image";
import type { ReactNode } from "react";
import { FaqList } from "@/components/home/FaqList";
import type { Benefit, Faq, Shop, Stat, Step } from "@/content/verticals/types";
import styles from "./vertical.module.css";

export function BenefitGrid({ items }: { items: Benefit[] }) {
  return (
    <ul className={styles.benefits}>
      {items.map((b) => (
        <li key={b.title} className={styles.benefit}>
          <div className={styles.benefitTop}>
            <div className={styles.benefitBig}>{b.big}</div>
            <span aria-hidden="true">↗</span>
          </div>
          <div>
            <div className={styles.benefitUnit}>{b.unit}</div>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ShopGrid({ items, theme = "dark" }: { items: Shop[]; theme?: "light" | "dark" }) {
  return (
    <ul className={`${styles.shops} ${theme === "light" ? styles.shopsLight : ""}`}>
      {items.map((s) => (
        <li key={s.title} className={styles.shop}>
          <div className={styles.shopImg}>
            <Image src={s.img} alt={s.alt} fill sizes="(max-width: 760px) 100vw, 400px" />
          </div>
          <div className={styles.shopBody}>
            <div className={styles.kicker}>{s.kicker}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StatGrid({ items }: { items: Stat[] }) {
  return (
    <dl className={styles.statGrid}>
      {items.map((s) => (
        <div key={s.label}>
          {s.prefix && <dt>{s.prefix}</dt>}
          <dd>
            <div className={styles.statValue}>
              {s.value}
              <span>{s.suffix ?? "%"}</span>
            </div>
            <div className={styles.statLabel}>{s.label}</div>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function StepList({ items }: { items: Step[] }) {
  return (
    <ol className={styles.steps}>
      {items.map((s, i) => (
        <li key={s.title} className={styles.step}>
          <div className={styles.stepTop}>
            <span className={`mono ${styles.stepNum}`}>{String(i + 1).padStart(2, "0")}</span>
            <span>Step {i + 1}</span>
          </div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqSection({ title, intro, actions, faqs }: { title: ReactNode; intro: string; actions: ReactNode; faqs: Faq[] }) {
  return (
    <section className={`section ${styles.py140}`}>
      <div className="container">
        <div className={styles.faqHead}>
          <div>
            <h2 className={styles.h2}>{title}</h2>
            <p>{intro}</p>
          </div>
          <div className={styles.ctaRow}>{actions}</div>
        </div>
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
}
