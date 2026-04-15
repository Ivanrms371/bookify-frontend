import { cn } from "@/shared/lib/utils"
import { generateHeights } from "@/shared/utils/chart"
import { useEffect, useState } from "react"

export const RevenueChartSkeleton = () => {
  const [heights, setHeights] = useState(() => generateHeights(30, 0))
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(generateHeights(30, Date.now() * 0.001))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
  )
}
