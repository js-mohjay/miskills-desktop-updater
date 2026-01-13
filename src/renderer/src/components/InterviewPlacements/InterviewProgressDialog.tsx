"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check } from "lucide-react"

export default function InterviewProgressDialog({
  open,
  onClose,
  interview,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-[8px] max-w-md bg-[#0f1117] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">
            {interview.company}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {interview.stages.map((stage: any, index: number) => {
            const completed = stage.status === "completed"
            const active = stage.status === "active"
            const isLast = index === interview.stages.length - 1

            return (
              <div key={stage.step} className="flex gap-4">
                {/* LEFT TIMELINE */}
                <div className="flex flex-col items-center">
                  {/* CIRCLE */}
                  <div
                    className={`
                      flex items-center justify-center
                      w-6 h-6 rounded-full border-2
                      ${
                        completed
                          ? "bg-violet-500 border-violet-500"
                          : active
                          ? "border-violet-500"
                          : "border-white/30"
                      }
                    `}
                  >
                    {completed && (
                      <Check className="size-3 text-white" />
                    )}

                    {active && !completed && (
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                    )}
                  </div>

                  {/* LINE */}
                  {!isLast && (
                    <div
                      className={`
                        w-px flex-1 mt-1
                        ${
                          completed
                            ? "bg-violet-500"
                            : "bg-white/20"
                        }
                      `}
                    />
                  )}
                </div>

                {/* RIGHT CONTENT */}
                <div className="pb-6">
                  <p className="text-sm font-semibold text-white tracking-wide uppercase">
                    {stage.title}
                  </p>
                  <p className="text-xs text-white/50 capitalize mt-1">
                    {stage.status}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
