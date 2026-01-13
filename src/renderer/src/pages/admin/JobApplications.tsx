"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobApplicationService } from "@/services/jobApplication.service";
import { JobApplicationListResponse } from "@/types/job-application";
import JobApplicationsTable from "@/components/admin/job-application/JobApplicationsTable";
import CreateJobApplicationDialog from "@/components/admin/job-application/CreateJobApplicationDialog";


export default function JobApplications() {
  const [page] = useState(1);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<JobApplicationListResponse>({
    queryKey: ["job-applications", page],
    queryFn: async () => {
      const res = await jobApplicationService.getAll({ page, limit: 10 });
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <section className="p-6">
        <div className="h-64 bg-white/10 rounded-[8px]" />
      </section>
    );
  }

  return (
    <section className="p-6 space-y-6!">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Job Applications</h1>

        <button className="btn-primary" onClick={() => setOpen(true)}>
          <span>+ Add Application</span>
        </button>
      </div>

      <JobApplicationsTable data={data?.data ?? []} />

      <CreateJobApplicationDialog
        open={open}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
