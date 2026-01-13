"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApplicationService } from "@/services/jobApplication.service";
import { useState } from "react";

export default function CreateJobApplicationDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();

  const [resume, setResume] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: (fd: FormData) => jobApplicationService.apply(fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-applications"] });
      onClose();
    },
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (resume) fd.append("resume", resume);
    mutation.mutate(fd);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-[8px] max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <Field label="User ID" name="userId" />
          <Field label="Subcategory ID" name="subcategory" />

          <Field label="Interview Date" name="interviewDate" type="date" />
          <Field label="Interview Time" name="interviewTime" type="time" />

          <Field label="Stage 1" name="stagesInput[]" />
          <Field label="Stage 2" name="stagesInput[]" />

          <div className="col-span-2">
            <label className="text-sm text-white/70">Resume</label>
            <input
              type="file"
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-white"
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button className="btn-primary">
              <span>Create Application</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-white/70">{label}</label>
      <input
        name={name}
        type={type}
        required
        className="w-full rounded-[8px] bg-zinc-900 border border-white/10 p-2"
      />
    </div>
  );
}
