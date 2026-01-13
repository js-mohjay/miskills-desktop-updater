"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { careerService } from "@/services/career.service"
import InterviewCard from "@/components/InterviewPlacements/InterviewCard"
import PlacementCard from "@/components/InterviewPlacements/PlacementCard"


export default function Career() {
  const [tab, setTab] = useState<"interviews" | "placements">("interviews")

  const interviews = useQuery({
    queryKey: ["student-interviews"],
    queryFn: () => careerService.getInterviews().then(res => res.data),
  })

  const placements = useQuery({
    queryKey: ["student-placements"],
    queryFn: () => careerService.getPlacements().then(res => res.data),
  })

  // console.log(interviews.data?.data)

  return (
    <div className="w-full p-10 space-y-6!">
      <h1 className="text-5xl mb-4!">
        Our Interviews & Placements
      </h1>
      {/* Tabs */}
      <div className="flex gap-2">
        {["interviews", "placements"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-6 py-2 rounded-[8px] text-xl! font-medium transition cursor-pointer
              ${tab === t
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-white/70 hover:bg-zinc-700"
              }`}
          >
            {t === "interviews" ? "Interviews" : "Placements"}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "interviews" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.data?.data && Array.isArray(interviews.data?.data) && interviews.data?.data.length > 0 ? interviews.data?.data?.map((i: any, idx: number) => (
            <InterviewCard key={idx} data={i} />
          )) : (
            <div>
              No Interview data available.
            </div>
          )}
        </div>
      )}

      {tab === "placements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {placements.data?.data && Array.isArray(placements.data?.data) && placements.data?.data.length > 0 ? placements.data?.data?.map((p: any, idx: number) => (
            <PlacementCard key={idx} data={p} />
          )) : (
            <div>
              No Placements data available.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
