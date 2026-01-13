"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function ConfirmDeleteAlert({
  open,
  title = "Delete?",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
}: {
  open: boolean
  title?: string
  description?: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="rounded-[8px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-3">
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
