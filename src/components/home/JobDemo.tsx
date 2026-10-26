"use client";

import { useState } from "react";
import styles from "./JobDemo.module.css";

const statuses = [
  { label: "Scheduled", bg: "#F1EEEB", c: "#5A5450", btn: "Start driving", toast: "Tap the button to start your day" },
  { label: "En route", bg: "#FFF4E0", c: "#B4690E", btn: "I’ve arrived. Start job", toast: "✓ Customer notified you’re on the way" },
  { label: "In progress", bg: "#E8EEFC", c: "#2F5BD3", btn: "Complete job", toast: "✓ Checklist and photos attached" },
  { label: "Complete", bg: "#E8F6EC", c: "#1F9D55", btn: "Send invoice", toast: "✓ Report saved to customer record" },
  { label: "Paid", bg: "#FDECEE", c: "#C93347", btn: "Next job →", toast: "✓ Invoice paid on site · $1,240.00" },
];

const jobs = [
  { time: "8:30 AM", customer: "Riverside Dental", service: "Annual fire alarm inspection", addr: "214 Harbor St" },
  { time: "11:00 AM", customer: "Oak Street Bakery", service: "Hood suppression service", addr: "88 Oak St" },
  { time: "2:15 PM", customer: "Maple Ridge HOA", service: "Backflow test", addr: "1200 Maple Ridge Dr" },
];

// Interactive phone mock-up showing a technician's day in the app.
export function JobDemo() {
  const [step, setStep] = useState(0);
  const [jobIdx, setJobIdx] = useState(0);
  const st = statuses[step];
  const job = jobs[jobIdx];
  const upNext = [1, 2].map((o) => jobs[(jobIdx + o) % jobs.length]);

  const advance = () => {
    if (step < statuses.length - 1) setStep(step + 1);
    else {
      setStep(0);
      setJobIdx((jobIdx + 1) % jobs.length);
    }
  };

  return (
    <div className={styles.phone}>
      <div className={styles.screen}>
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.notch} />
          <span className={styles.signal}>●●● ▮</span>
        </div>
        <div className={styles.greeting}>
          <div>
            <div className={styles.small}>Good morning</div>
            <div className={styles.name}>Mike · 3 jobs today</div>
          </div>
          <span className={styles.initial} aria-hidden="true">M</span>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span className="mono">{job.time}</span>
            <span className={styles.pill} style={{ background: st.bg, color: st.c }}>
              {st.label}
            </span>
          </div>
          <div className={styles.customer}>{job.customer}</div>
          <div className={styles.service}>{job.service}</div>
          <div className={styles.addr}>⌖ {job.addr}</div>
          <div className={styles.steps} aria-hidden="true">
            {statuses.map((s, i) => (
              <span key={s.label} data-done={i <= step} />
            ))}
          </div>
        </div>
        <div className={styles.toast} aria-live="polite">
          {st.toast}
        </div>
        <div className={styles.btnWrap}>
          <button type="button" onClick={advance} className={styles.btn} data-paid={step === statuses.length - 1}>
            {st.btn}
          </button>
        </div>
        <div className={styles.upNextLabel}>Up next</div>
        {upNext.map((u) => (
          <div key={u.customer} className={styles.upNext}>
            <div>
              <div className={styles.upCustomer}>{u.customer}</div>
              <div className={styles.upService}>{u.service}</div>
            </div>
            <span className="mono">{u.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
