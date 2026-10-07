export function ReportsLoading() {
  return (
    <div role="status" aria-label="Cargando reportes" className="space-y-6">
      <span className="sr-only">Cargando reportes…</span>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((index) => <div key={index} className="h-36 animate-pulse rounded-2xl bg-gray-100" />)}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
}
