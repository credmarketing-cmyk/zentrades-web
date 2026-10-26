"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { PRICING } from "@/lib/links";
import styles from "./ModulePicker.module.css";

export function ModulePicker({ modules }: { modules: string[] }) {
  const [selected, setSelected] = useState(["Invoicing & Estimates", "Schedule & Dispatch", "Online Payments"]);
  const toggle = (m: string) => setSelected((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3>Build your ZenTrades</h3>
        <span className="mono">
          {selected.length} of {modules.length} selected
        </span>
      </div>
      <div className={styles.chips}>
        {modules.map((m) => {
          const on = selected.includes(m);
          return (
            <button key={m} type="button" aria-pressed={on} className={styles.chip} onClick={() => toggle(m)}>
              <span aria-hidden="true">{on ? "✓" : "+"}</span>
              {m}
            </button>
          );
        })}
      </div>
      <div className={styles.divider} />
      <div className={styles.foot}>
        <p>Pay only for the modules your team uses. Add more anytime.</p>
        <ButtonLink href={PRICING} variant="red" size="lg" arrow>
          Get my pricing
        </ButtonLink>
      </div>
    </div>
  );
}
