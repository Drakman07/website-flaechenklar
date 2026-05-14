import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

export function TealUnderline({ children }: { children: ReactNode }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.6);
  return (
    <span
      ref={ref}
      className={`teal-underline ${inView ? "is-drawn" : ""}`}
    >
      {children}
    </span>
  );
}
