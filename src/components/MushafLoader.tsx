/**
 * Placeholder while QCF page fonts register — RTL bars flush to the
 * inline-start edge (right in Arabic).
 */
export default function MushafLoader({
  lines = 5,
}: {
  lines?: number;
}) {
  const widths = [92, 78, 88, 70, 84];

  return (
    <div
      className="py-2"
      role="status"
      aria-live="polite"
      aria-label="Loading mushaf"
      dir="rtl"
    >
      <p className="sr-only">Loading mushaf text…</p>
      <div className="flex flex-col items-stretch gap-10">
        {Array.from({ length: lines }, (_, row) => (
          <div
            key={row}
            className="h-10 max-w-full animate-pulse rounded-sm bg-(--sl-color-gray-5)/55 me-auto md:h-12"
            style={{ width: `${widths[row % widths.length]}%` }}
          />
        ))}
      </div>
    </div>
  );
}
