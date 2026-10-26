"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Story } from "@/content/home";
import styles from "./home.module.css";

// TODO: replace with the real video / case study URL for each customer.
const storyHref: Record<string, string> = {
  "Pastion Industries": "/zenfire/case-study/pastion-industries-success-story",
};

export function StoryPanels({ stories }: { stories: Story[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.storyRow}>
      {stories.map((s, i) => (
        <article
          key={s.company}
          className={styles.storyPanel}
          data-active={i === active}
          tabIndex={i === active ? -1 : 0}
          aria-label={`${s.company} customer story`}
          onMouseEnter={() => setActive(i)}
          onClick={() => setActive(i)}
          onFocus={() => setActive(i)}
        >
          <Image src={s.img} alt={`${s.name} from ${s.company}`} fill sizes="(max-width: 760px) 100vw, 800px" className={styles.storyImg} />
          <div className={styles.storyShade} />
          <span className={styles.storyTrade}>{s.trade}</span>
          <span className={styles.storyVertical} aria-hidden="true">
            {s.company}
          </span>
          <div className={styles.storyBody}>
            <span className={styles.storyCompany}>{s.company}</span>
            <blockquote className={styles.storyQuote}>“{s.quote}”</blockquote>
            <div className={styles.storyFoot}>
              <cite>
                {s.name}
                <span>{s.role}</span>
              </cite>
              <Link href={storyHref[s.company] ?? "/testimonials"} className={styles.pillBtn}>
                <span aria-hidden="true">▶</span>Watch the story
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
