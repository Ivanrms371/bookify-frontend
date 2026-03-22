import { cn } from "@/shared/lib/utils";
import { useEffect, useState } from "react";

function generateHeights(count: number, seed: number) {
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    const base =
      25 +
      Math.sin((i + seed) * 0.5) * 20 +
      Math.cos((i + seed * 0.7) * 0.3) * 15;
    heights.push(Math.max(10, Math.min(85, base)));
  }
  return heights;
}

export const RevenueChartSkeleton = () => {
  const [heights, setHeights] = useState(() => generateHeights(30, 0));
  const [animate, setAnimate] = useState(false);

  // Trigger initial grow animation
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  // Regenerate heights every 3s for a "living" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(generateHeights(30, Date.now() * 0.001));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "col-span-7 flex flex-col rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 p-6",
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="h-4 w-40 bg-mist-100 dark:bg-mist-900/80 rounded-md animate-pulse" />
        <div className="h-9 w-24 bg-mist-100 dark:bg-mist-900/80 rounded-md animate-pulse" />
      </div>

      {/* Bars */}
      <div className="flex-1 flex items-end gap-2.5 min-h-[220px]">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-full bg-indigo-500"
            style={{
              height: animate ? `${h}%` : "0%",
              transition: `height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 30}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
