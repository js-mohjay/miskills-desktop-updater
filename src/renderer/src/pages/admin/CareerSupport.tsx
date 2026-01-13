"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CareerSupportListResponse } from "@/types/admin.career-support";
import { adminCareerSupportService } from "@/services/admin.career-support";
import CreateCareerSupportDialog from "@/components/admin/career-support/CreateCareerSupportDialog";
import ResumeActions from "@/components/admin/career-support/ResumeActions";
import UpdateStatusDialog from "@/components/admin/career-support/UpdateCareerSupportDialog";


const CareerSupport = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery<CareerSupportListResponse>({
    queryKey: ["admin-career-support", page],
    queryFn: async () => {
      const res = await adminCareerSupportService.getAll(page, limit);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="h-64 bg-white/10 rounded-[8px]" />;
  }

  return (
    <section className="p-6 space-y-6!">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Career Support</h1>

        <CreateCareerSupportDialog />
      </div>

      {/* Table */}
      <div className="border border-white/10 rounded-[8px] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Job Type</th>
              <th className="px-4 py-3">Resume</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.data.map((item) => (
              <tr
                key={item._id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{item.userId.name}</p>
                  <p className="text-white/60">{item.userId.email}</p>
                </td>

                <td className="px-4 py-3">{item.preferredCompany}</td>
                <td className="px-4 py-3">{item.experience}</td>
                <td className="px-4 py-3">{item.jobType}</td>

                <td className="px-4 py-3">
                  <ResumeActions url={item.resume} />
                </td>

                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-[8px] border bg-blue-600/20 border-blue-500 text-blue-300">
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <UpdateStatusDialog item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CareerSupport;
