import { JobApplication } from "@/types/job-application";
import InterviewStatusSelect from "./InterviewStatusSelect";

const DEFAULT_STAGES = ["Pending", "Technical", "HR", "Placed", "Rejected"];

export default function JobApplicationsTable({
  data,
}: {
  data: JobApplication[];
}) {
  return (
    <div className="border border-white/10 rounded-[8px] overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-sm">
          <tr>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Subcategory</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Package</th>
            <th className="px-4 py-3">Interview Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((app) => (
            <tr
              key={app.applicationId}
              className="border-t border-white/5 hover:bg-white/5 text-sm"
            >
              <td className="px-4 py-3 font-medium">
                {app.studentName}
              </td>
              <td className="px-4 py-3 text-white/70">
                {app.studentEmail}
              </td>
              <td className="px-4 py-3">{app.subcategory}</td>
              <td className="px-4 py-3">{app.company || "-"}</td>
              <td className="px-4 py-3">{app.package || "-"}</td>
              <td className="px-4 py-3">
                <InterviewStatusSelect
                  applicationId={app.applicationId}
                  value={app.interviewStatus}
                  stages={DEFAULT_STAGES}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
