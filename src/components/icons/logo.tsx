/** Crescent + ink-dot mark (Concept C — Ink crescent). */
export default function IconLogo({
  className,
  size = 44,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Qurescent"
    >
      <path
        className="fill-accent-600 dark:fill-accent-400"
        style={{ fill: "var(--sl-color-accent, #9B2458)" }}
        d="M46.65 16.10A23.50 23.50 0 1 0 46.65 47.90A17.50 17.50 0 1 1 46.65 16.10Z"
      />
      <circle
        cx="54.15"
        cy="32"
        r="4"
        style={{ fill: "var(--sl-color-accent-high, #5C1034)" }}
      />
    </svg>
  );
}
