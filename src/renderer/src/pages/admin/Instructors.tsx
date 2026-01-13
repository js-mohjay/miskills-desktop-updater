"use client"

import { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  adminInstructorService,
} from "@/services/admin.service"
import {
  InstructorListResponse,
} from "@/types/admin.instructor"

import InstructorDialog from "@/components/admin/InstructorDialog"
import DeleteInstructorAlert from "@/components/admin/DeleteInstructorAlert"


/* -------------------------------------------------------------------------- */

const Instructors = () => {
  const [dialog, setDialog] = useState<{
    type: "add" | "view" | "edit" | null
    instructor?: any
  }>({ type: null })

  const [deleteId, setDeleteId] = useState<string | null>(null)


  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } =
    useQuery<InstructorListResponse>({
      queryKey: ["admin-instructors", page, limit],
      queryFn: async () => {
        const res =
          await adminInstructorService.getInstructors(
            page,
            limit
          )
        return res.data
      },
      placeholderData: keepPreviousData

    })

  if (isLoading) {
    return <PageSkeleton />
  }

  if (isError || !data?.success) {
    return (
      <section className="p-6">
        <p className="text-red-400">
          Failed to load instructors
        </p>
      </section>
    )
  }

  const { instructors, pagination } = data.data

  return (
    <section className="w-full p-6 space-y-6!">
      {/* ----------------------------- HEADER ----------------------------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Instructors
        </h1>

        <button
          className="btn-primary"
          onClick={() => setDialog({ type: "add" })}
        >
          <span>
            + Add Instructor
          </span>
        </button>

      </div>

      {/* ------------------------------ TABLE ------------------------------ */}
      <div className="border border-white/10 rounded-[8px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-sm">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {instructors.map((inst) => (
              <tr
                key={inst._id}
                className="border-t border-white/5 text-sm hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {inst.name}
                </td>

                <td className="px-4 py-3 text-white/70">
                  {inst.email}
                </td>

                <td className="px-4 py-3">
                  {inst.phoneNumber}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge active={inst.isActive} />
                </td>

                <td className="px-4 py-3">
                  <VerificationBadge
                    verified={inst.isVerified}
                  />
                </td>

                <td className="px-4 py-3 text-white/60">
                  {new Date(
                    inst.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right space-x-3!">
                  <button
                    className="text-violet-400 hover:underline cursor-pointer"
                    onClick={() =>
                      setDialog({
                        type: "view",
                        instructor: inst,
                      })
                    }
                  >
                    View
                  </button>

                  <button
                    className="text-blue-400 hover:underline cursor-pointer"
                    onClick={() =>
                      setDialog({
                        type: "edit",
                        instructor: inst,
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-400 hover:underline cursor-pointer"
                    onClick={() => setDeleteId(inst._id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------------------- PAGINATION --------------------------- */}
      <div className="flex justify-end items-center gap-3">
        <button
          className="px-3 py-1 border border-white/10 rounded-[8px] disabled:opacity-40"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="text-sm text-white/60">
          Page {pagination.current} of{" "}
          {pagination.total}
        </span>

        <button
          className="px-3 py-1 border border-white/10 rounded-[8px] disabled:opacity-40"
          disabled={page === pagination.total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {dialog.type && (
        <InstructorDialog
          open={!!dialog.type}
          mode={dialog.type}
          instructor={dialog.instructor}
          onClose={() => setDialog({ type: null })}
        />
      )}

      {deleteId && (
        <DeleteInstructorAlert
          open={!!deleteId}
          instructorId={deleteId}
          onClose={() => setDeleteId(null)}
        />
      )}


    </section>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`px-2 py-1 rounded-[8px] text-xs font-medium border ${active
        ? "bg-green-600/20 border-green-500 text-green-300"
        : "bg-red-600/20 border-red-500 text-red-300"
        }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  )
}

function VerificationBadge({
  verified,
}: {
  verified: boolean
}) {
  return (
    <span
      className={`px-2 py-1 rounded-[8px] text-xs font-medium border ${verified
        ? "bg-blue-600/20 border-blue-500 text-blue-300"
        : "bg-yellow-600/20 border-yellow-500 text-yellow-300"
        }`}
    >
      {verified ? "Verified" : "Pending"}
    </span>
  )
}

function PageSkeleton() {
  return (
    <section className="p-6 space-y-4!">
      <div className="h-8 w-48 bg-white/10 rounded-[8px]" />
      <div className="h-64 bg-white/10 rounded-[8px]" />
    </section>
  )
}


export default Instructors
