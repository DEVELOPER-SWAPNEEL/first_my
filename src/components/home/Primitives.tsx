import Link from "next/link";
import type { DraftFixture } from "@/content/home-draft";
import styles from "./Home.module.css";
import { RevealWords } from "../motion/Text";
export function SectionHeading({
  label,
  fixture,
  id,
}: {
  label: string;
  fixture: DraftFixture;
  id: string;
}) {
  return (
    <div className={styles.heading}>
      <span className="motion-rule" data-reveal="rule" aria-hidden="true" />
      <p
        className={styles.eyebrow}
        data-reveal="eyebrow"
      >{`// ${label} · DRAFT`}</p>
      <h2 id={id} data-reveal="words">
        <RevealWords text={fixture.title} />
      </h2>
      <p className={styles.lead}>{fixture.description}</p>
    </div>
  );
}
export function Placeholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`${styles.placeholder} ${className}`}
      role="img"
      aria-label={`${label}: image pending, neutral placeholder`}
    >
      <span className={styles.placeholderLabel}>
        {label}
        <br />
        Image pending · DRAFT
      </span>
    </div>
  );
}
export function Action({
  href,
  children,
  primary = false,
  quiet = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  quiet?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        quiet
          ? styles.textLink
          : `${styles.action} ${primary ? styles.primary : ""}`
      }
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
export function PendingAction({
  children,
  reason,
}: {
  children: React.ReactNode;
  reason: string;
}) {
  return (
    <span className={styles.pendingAction}>
      <button
        type="button"
        disabled
        className={styles.action}
        aria-label={`${children}. ${reason}`}
      >
        {children}
        <span aria-hidden="true">↓</span>
      </button>
      <span className={styles.small}>{reason}</span>
    </span>
  );
}
