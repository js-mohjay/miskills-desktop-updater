"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { Student } from "@/types/student";

export default function EditStudentDialog({
  open,
  onClose,
  student,
}: {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}) {
  const form = useForm({
    defaultValues: student ?? {},
  });

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: any) =>
      studentService.update(student!._id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      onClose();
    },
  });

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-[8px] max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="grid grid-cols-2 gap-4"
        >
          <Field label="Name" {...form.register("name")} />
          <Field label="Email" {...form.register("email")} />
          <Field label="Phone" {...form.register("phoneNumber")} />

          <div className="col-span-2">
            <Field label="Address" {...form.register("address")} />
          </div>

          <div className="col-span-2 flex justify-end">
            <button className="btn-primary">
              <span>Update Student</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-white/70">{label}</label>
      <input
        {...props}
        className="w-full rounded-[8px] bg-zinc-900 border border-white/10 p-2"
      />
    </div>
  );
}
