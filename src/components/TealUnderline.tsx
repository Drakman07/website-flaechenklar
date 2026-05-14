import type { ReactNode } from "react";

export function TealUnderline({ children }: { children: ReactNode }) {
  return <span className="teal-underline">{children}</span>;
}
