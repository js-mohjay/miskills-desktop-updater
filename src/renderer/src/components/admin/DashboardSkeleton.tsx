const DashboardSkeleton = () => {
  return (
    <section className="p-6 space-y-6">
      <div className="h-6 w-48 bg-white/10 rounded" />

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-white/10 rounded"
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="h-64 bg-white/10 rounded" />
        <div className="h-64 bg-white/10 rounded" />
      </div>
    </section>
  )
}

export default DashboardSkeleton
