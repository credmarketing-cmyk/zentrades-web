"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { complianceEngine as Tce, integrations as Integrations } from "@/content/home";
import styles from "./home.module.css";

type Props = { items: typeof Integrations; tce: typeof Tce };

export function IntegrationHub({ items, tce }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const hovered = [...items, tce].find((d) => d.name === active);
  const hub = hovered
    ? { title: `${hovered.name} ⇄ ZenTrades`, text: hovered.text }
    : { title: "Your stack, connected", text: "Hover a tool to see what syncs with ZenTrades." };

  const bind = (name: string) => ({
    onMouseEnter: () => setActive(name),
    onFocus: () => setActive(name),
    "data-active": active === name,
  });

  return (
    <div className={styles.integGrid} onMouseLeave={() => setActive(null)}>
      {items.map((d) => (
        <Link
          key={d.name}
          href={d.href}
          className={styles.integTile}
          style={{ "--col": d.col, "--row": d.row } as CSSProperties}
          aria-label={`${d.name} integration`}
          {...bind(d.name)}
        >
          <Image src={d.img} alt={d.name} width={300} height={100} />
        </Link>
      ))}

      <div className={styles.hub} aria-live="polite">
        <div className={styles.hubTop}>
          <Image src="/images/logo-zt-white.png" alt="ZenTrades" width={2340} height={327} style={{ height: 14, width: "auto" }} />
          <span>
            <span className={styles.liveDot} />
            Synced
          </span>
        </div>
        <div className={styles.hubBody}>
          <div className={styles.hubTitle}>{hub.title}</div>
          <div className={styles.hubText}>{hub.text}</div>
        </div>
      </div>

      <Link href={tce.href} className={styles.tce} {...bind(tce.name)}>
        <Image src="/images/int-compliance.png" alt="" width={341} height={286} />
        <div className={styles.tceCopy}>
          <h3>{tce.name}</h3>
          <p>For fire &amp; life safety teams that report to their AHJ.</p>
        </div>
        <span className={styles.tceLink}>Fire &amp; inspection →</span>
      </Link>
    </div>
  );
}
