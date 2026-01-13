"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminInstructorService } from "@/services/admin.service"

type Mode = "add" | "view" | "edit"

type Props = {
  open: boolean
  onClose: () => void
  mode: Mode
  instructor?: any
}

export default function InstructorDialog({
  open,
  onClose,
  mode,
  instructor,
}: Props) {
  const isView = mode === "view"
  const isEdit = mode === "edit"

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      specializations: "",
      skills: "",
    },
  })

  useEffect(() => {
    if (instructor) {
      form.reset({
        name: instructor.name,
        email: instructor.email,
        phoneNumber: instructor.phoneNumber,
        specializations: instructor.specializations || "",
        skills: instructor.skills?.join(", ") || "",
      })
    }
  }, [instructor, form])

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = {
        ...values,
        skills: values.skills
          .split(",")
          .map((s: string) => s.trim()),
      }

      if (isEdit) {
        return adminInstructorService.updateInstructor(
          instructor._id,
          payload
        )
      }

      return adminInstructorService.createInstructor(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-instructors"],
      })
      onClose()
    },
  })

  const onSubmit = (values: any) => {
    if (!isView) mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === "add"
              ? "Add Instructor"
              : mode === "edit"
              ? "Edit Instructor"
              : "Instructor Details"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <InputField
            label="Name"
            disabled={isView}
            {...form.register("name")}
          />
          <InputField
            label="Email"
            disabled={isView}
            {...form.register("email")}
          />
          <InputField
            label="Phone Number"
            disabled={isView}
            {...form.register("phoneNumber")}
          />
          <InputField
            label="Specializations"
            disabled={isView}
            {...form.register("specializations")}
          />
          <InputField
            label="Skills (comma separated)"
            disabled={isView}
            {...form.register("skills")}
          />

          {!isView && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
              >
                <span>
                  {isEdit ? "Update" : "Create"}
                </span>
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

function InputField({
  label,
  ...props
}: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-white/70">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-white/10 rounded-[8px] bg-transparent"
      />
    </div>
  )
}
