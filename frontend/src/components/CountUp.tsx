import { useEffect, useRef, useState } from "react";

export function CountUp({
  target,
  duration = 2,
  suffix = "",
  locale = "vi-VN",
}: {
  target: number;
  duration?: number;
  suffix?: string;
  locale?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplay(Math.floor(target).toLocaleString(locale));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const startTime = performance.now();
          const durationMs = duration * 1000;

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            setDisplay(current.toLocaleString(locale));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplay(Math.floor(target).toLocaleString(locale));
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, locale]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
