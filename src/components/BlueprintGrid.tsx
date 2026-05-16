import type { CSSProperties } from "react";

export function BlueprintGrid({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 grid-blueprint-dark ${className}`}
      style={style}
    />
  );
}
