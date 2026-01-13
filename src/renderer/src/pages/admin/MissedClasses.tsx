"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  adminRecoveryService,
} from "@/services/admin.service"
import {
  MissedStudentsResponse,
  MissedStudent,
} from "@/types/admin.recovery"
import RecoverDialog from "@/components/admin/missed-classes/RecoverDialog"

/* -------------------------------------------------------------------------- */

const MissedClasses = () => {
  const [page, setPage] = useState(1)
  const [selectedStudent, setSelectedStudent] =
    useState<MissedStudent | null>(null)

  const { data, isLoading, isError } =
    useQuery<MissedStudentsResponse>({
      queryKey: ["admin-missed-classes", page],
      queryFn: async () => {
        const res =
          await adminRecoveryService.getStudentsWithMissedClasses(
            page,
            10
          )
        return res.data
      },
    })

  if (isLoading) return <PageSkeleton />
  if (isError || !data?.success)
    return <ErrorState />

  return (
    <section className="w-full p-6 space-y-6!">
      <h1 className="text-3xl font-semibold">
        Missed Classes
      </h1>

      <div className="border border-white/10 rounded-[8px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-sm">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Missed</th>
              <th className="px-4 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.data.map((student) => (
              <tr
                key={student.userId}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {student.name}
                </td>
                <td className="px-4 py-3 text-white/70">
                  {student.email}
                </td>
                <td className="px-4 py-3">
                  {student.missedCount}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={() =>
                      setSelectedStudent(student)
                    }
                  >
                    <span>Recover</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <RecoverDialog
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function PageSkeleton() {
  return (
    <section className="p-6 space-y-4!">
      <div className="h-8 w-64 bg-white/10 rounded-[8px]" />
      <div className="h-64 bg-white/10 rounded-[8px]" />
    </section>
  )
}

function ErrorState() {
  return (
    <section className="p-6 text-red-400">
      Failed to load missed classes
    </section>
  )
}

export default MissedClasses
