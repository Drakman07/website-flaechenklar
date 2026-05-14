import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element = HTMLDivElement>(
  threshold = 0.2,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold, inView]);

  return [ref, inView] as const;
}
