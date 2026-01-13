export function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="border border-white/10 rounded-[8px] p-4">
      <p className="text-sm text-white/60 mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold">
        {value}
      </p>
    </div>
  )
}
