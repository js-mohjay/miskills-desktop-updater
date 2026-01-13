"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  adminRecoveryService,
} from "@/services/admin.service"
import { RecoveryBatch } from "@/types/admin.recovery"

/* -------------------------------------------------------------------------- */

export default function RecoverDialog({
  student,
  onClose,
}: {
  student: any
  onClose: () => void
}) {
  const subcategoryId =
    student.missedClasses[0].subcategoryId

  const [selectedBatch, setSelectedBatch] =
    useState<string>("")

  const { data } = useQuery({
    queryKey: [
      "recovery-batches",
      student.userId,
      subcategoryId,
    ],
    queryFn: async () => {
      const res =
        await adminRecoveryService.getRecoveryBatches(
          student.userId,
          subcategoryId
        )
      return res.data
    },
  })

  const mutation = useMutation({
    mutationFn: () =>
      adminRecoveryService.recoverMissedClasses({
        userId: student.userId,
        subcategoryId,
        newBatchId: selectedBatch,
      }),
    onSuccess: () => onClose(),
  })

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-[8px]">
        <DialogHeader>
          <DialogTitle>
            Recover Missed Classes
          </DialogTitle>
        </DialogHeader>

        {/* Missed info */}
        <div className="space-y-2 text-sm">
          {student.missedClasses.map((c: any) => (
            <div
              key={c.liveClassId}
              className="border border-white/10 rounded-[8px] px-3 py-2"
            >
              Day {c.day} – {c.batchName}
            </div>
          ))}
        </div>

        {/* Batch select */}
        <select
          className="w-full mt-4 bg-black border border-violet-500/50 rounded-[8px] px-3 py-2 text-white"
          value={selectedBatch}
          onChange={(e) =>
            setSelectedBatch(e.target.value)
          }
        >
          <option value="">Select batch</option>
          {data?.data?.map((b: RecoveryBatch) => (
            <option
              key={b._id}
              value={b._id}
            >
              {b.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border border-white/10 rounded-[8px] cursor-pointer w-1/2"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-[8px] transition duration-200 cursor-pointer w-1/2"
            disabled={!selectedBatch}
            onClick={() => mutation.mutate()}
          >
            Confirm Recovery
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
