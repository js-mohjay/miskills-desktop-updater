"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminInstructorService } from "@/services/admin.service"

export default function DeleteInstructorAlert({
  open,
  onClose,
  instructorId,
}: {
  open: boolean
  onClose: () => void
  instructorId: string
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () =>
      adminInstructorService.deleteInstructor(
        instructorId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-instructors"],
      })
      onClose()
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-[8px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Instructor?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-3">
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate()}
            className="bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
