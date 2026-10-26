"use client";

import { useState } from "react";
import styles from "./FaqList.module.css";

// Answers stay in the HTML when collapsed so search engines can read them.
export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={styles.list}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.question} className={styles.item} data-open={isOpen}>
            <h3 className={styles.heading}>
              <button
                type="button"
                className={styles.question}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className={styles.qText}>
                  <span className={`mono ${styles.num}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{f.question}</span>
                </span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h3>
            <div id={`faq-${i}`} className={styles.panel} role="region">
              <div>
                <p className={styles.answer}>{f.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
