"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Reveal on scroll untuk baris/grid katalog: stagger anak-anak bertanda
// `[data-reveal]` saat masuk viewport. Dilewati saat reduced-motion.
export function Reveal({
  children,
  className,
  y = 24,
  stagger = 0.06,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const targets = root.querySelectorAll("[data-reveal]");
      if (targets.length === 0) return;

      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.6,
        ease: "power2.out",
        stagger,
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
