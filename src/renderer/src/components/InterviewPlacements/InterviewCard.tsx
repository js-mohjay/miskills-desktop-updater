"use client"

import { useState } from "react"
import InterviewProgressDialog from "./InterviewProgressDialog"


export default function InterviewCard({ data }: any) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-[8px] border border-white/10 bg-zinc-900 p-4 hover:border-violet-500 transition space-y-2!"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg text-white font-semibold">Company: {data.company}</h3>
            <h2 className="text-base text-white font-semibold">Name: {data.studentName}</h2>
            <h2 className="text-base text-white font-semibold">Phone: {data.phone}</h2>
            <h2 className="text-base text-white font-semibold">E-Mail: {data.email}</h2>
            <p className="text-base text-white/60">Location: {data.location}</p>
          </div>

          <span className="text-base px-3 py-1 h-fit rounded-[8px] bg-violet-500/20 border border-violet-500 text-violet-100">
            {data.interviewStatus}
          </span>
        </div>

        <div className="mt-3 text-base text-white/70">
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
