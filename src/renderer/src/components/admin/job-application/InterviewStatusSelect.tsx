"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApplicationService } from "@/services/jobApplication.service";

export default function InterviewStatusSelect({
  applicationId,
  value,
  stages,
}: {
  applicationId: string;
  value: string;
  stages: string[];
}) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (status: string) =>
      jobApplicationService.updateInterviewStatus(applicationId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-applications"] });
    },
  });

  return (
    <select
      value={value}
      onChange={(e) => mutation.mutate(e.target.value)}
      className="rounded-[8px] bg-zinc-900 border border-white/10 px-2 py-1 text-sm text-white"
    >
      {stages.map((stage) => (
        <option key={stage} value={stage} className="bg-zinc-900">
          {stage}
        </option>
      ))}
    </select>
  );
}
