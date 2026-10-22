import styles from "./Home.module.css";
export function AbstractDiagram({
  labels,
  note,
}: {
  labels: readonly string[];
  note: string;
}) {
  return (
    <figure className={styles.abstractDiagram}>
      <svg
        viewBox="0 0 620 620"
        role="img"
        aria-label={`Illustration: ${labels.join(" to ")}. ${note}`}
      >
        <path
          d="M310 170V258M310 350V438"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m304 248 6 10 6-10m-12 180 6 10 6-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {labels.map((label, i) => (
          <g key={label}>
            <rect x="100" y={90 + i * 174} width="420" height="86" rx="14" />
            <text x="310" y={141 + i * 174} textAnchor="middle">
              {label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>{note}</figcaption>
    </figure>
  );
}
