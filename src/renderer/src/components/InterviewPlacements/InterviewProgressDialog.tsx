"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, Circle } from "lucide-react"

export default function InterviewProgressDialog({
  open,
  onClose,
  interview,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-[8px] max-w-md">
        <DialogHeader>
          <DialogTitle>{interview.company}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {interview.stages.map((stage: any) => {
            const completed = stage.status === "completed"
            const active = stage.status === "active"

            return (
              <div key={stage.step} className="flex gap-3 items-start">
                <div>
                  {completed ? (
                    <CheckCircle className="text-green-500 size-5" />
                  ) : (
                    <Circle
                      className={`size-5 ${
                        active ? "text-violet-500" : "text-white/30"
                      }`}
                    />
                  )}
                </div>

                <div>
                  <p className="text-white font-medium">{stage.title}</p>
                  <p className="text-xs text-white/50 capitalize">
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
