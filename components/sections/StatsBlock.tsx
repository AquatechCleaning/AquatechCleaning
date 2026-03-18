"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
};

type Props = {
  stats: Stat[];
};

export function StatsBlock({ stats }: Props) {
  const [visible, setVisible] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[]>(stats.map(() => 0));
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const durations = stats.map(() => 1200);
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / Math.max(...durations));
      setDisplayValues(
        stats.map((stat, idx) => Math.round(stat.value * progress * (stat.decimals ? 10 ** stat.decimals : 1)) / (stat.decimals ? 10 ** stat.decimals : 1))
      );
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <div
      ref={ref}
      className="grid gap-4 rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat, idx) => (
        <div key={stat.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <p className="text-sm uppercase tracking-wide text-slate-500">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {visible
              ? displayValues[idx]?.toLocaleString(undefined, {
                  maximumFractionDigits: stat.decimals ?? 0,
                })
              : "0"}
            {stat.suffix}
          </p>
        </div>
      ))}
    </div>
  );
}
