"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Loader } from "lucide-react"

type Props = {
  open: boolean
  batch: any
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmEnrollDialog({
  open,
  batch,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  const [input, setInput] = useState("")

  const isMatch = input === batch.name

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-black border border-orange-500/40 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-orange-400">
            Confirm Batch Enrollment
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-3! text-white/70">
            <p>
              You are about to enroll in the batch:
            </p>

            <p className="text-white font-semibold">
              {batch.name}
            </p>

            <p>
              Start Date:{" "}
              <span className="text-white">
                {new Date(batch.startDate).toLocaleDateString("en-IN")}
              </span>
            </p>

            <p className="text-orange-400">
              This action cannot be undone.
            </p>

            <p>
              To confirm, type{" "}
              <span className="font-semibold text-white">
                {batch.name}
              </span>{" "}
              below:
            </p>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type batch name to confirm"
              className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded text-white"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={!isMatch || loading}
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              "Enroll Batch"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
