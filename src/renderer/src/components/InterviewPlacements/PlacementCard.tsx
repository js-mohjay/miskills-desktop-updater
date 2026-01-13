"use client"

export default function PlacementCard({ data }: any) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-zinc-900 p-4">
      <h3 className="text-white font-semibold">{data.company}</h3>

      <p className="text-sm text-white/60">
        {data.location}
      </p>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-white/80">{data.role || "Role not specified"}</span>
        <span className="text-green-400 font-semibold">
          {data.package}
        </span>
      </div>
    </div>
  )
}
