import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Button.module.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light" | "red" | "outline" | "underline";
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "dark", size = "md", arrow = false, className }: Props) {
  const external = /^https?:\/\//.test(href);
  const cls = [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
