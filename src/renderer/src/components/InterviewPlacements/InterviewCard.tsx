"use client"

import { useState } from "react"
import InterviewProgressDialog from "./InterviewProgressDialog"


export default function InterviewCard({ data }: any) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-[8px] border border-white/10 bg-zinc-900 p-4 hover:border-violet-500 transition"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="text-white font-semibold">{data.company}</h3>
            <p className="text-sm text-white/60">{data.location}</p>
          </div>

          <span className="text-xs px-3 py-1 rounded-[8px] bg-violet-600/20 text-violet-300">
            {data.interviewStatus}
          </span>
        </div>

        <div className="mt-3 text-sm text-white/70">
          📅 {data.interviewDate} · ⏰ {data.interviewTime}
        </div>
      </div>

      <InterviewProgressDialog
        open={open}
        onClose={() => setOpen(false)}
        interview={data}
      />
    </>
  )
}
