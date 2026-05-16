export function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 grid-blueprint-dark ${className}`}
    />
  );
}
