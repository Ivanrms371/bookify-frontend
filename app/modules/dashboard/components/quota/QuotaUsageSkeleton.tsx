export function QuotaUsageSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl p-5 bg-white dark:bg-transparent dark:border dark:border-mist-900/70 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="size-14 rounded-full bg-mist-200 dark:bg-mist-900" />
            <div className="h-6 w-16 rounded-xl bg-mist-200 dark:bg-mist-900" />
          </div>
          <div className="h-4 w-24 rounded-xl bg-mist-200 dark:bg-mist-900 mb-3" />
          <div className="h-4 rounded-full bg-mist-200 dark:bg-mist-900" />
        </div>
      ))}
    </div>
  )
}
