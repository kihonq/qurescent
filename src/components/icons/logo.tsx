/** Crescent + ink-dot mark (design-system concept 3). */
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
        d="M48 12A24 24 0 1 0 48 52 17 17 0 1 1 48 12z"
      />
      <circle
        cx="46"
        cy="32"
        r="6"
        style={{ fill: "var(--sl-color-accent-high, #5C1034)" }}
      />
    </svg>
  );
}
