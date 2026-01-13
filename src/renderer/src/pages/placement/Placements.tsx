"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { placementService } from "@/services/placement.service"
import { PlacementListResponse } from "@/types/placement.types"

/* -------------------------------------------------------------------------- */

const Placements = () => {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } =
    useQuery<PlacementListResponse>({
      queryKey: ["placements", page, limit],
      queryFn: async () => {
        const res =
          await placementService.getPlacements(
            page,
            limit
          )
        return res.data
      },
      staleTime: 1000 * 60 * 5,
    })

  if (isLoading) {
    return <PageSkeleton />
  }

  if (isError || !data?.success) {
    return (
      <section className="p-6">
        <p className="text-red-400">
          Failed to load placements
        </p>
      </section>
    )
  }

  const { data: placements, pagination } = data

  return (
    <section className="w-full p-6 space-y-6!">
      {/* ----------------------------- HEADER ----------------------------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Placements
        </h1>

        <button className="btn-primary">
          <span>
            + Add Placement
          </span>
        </button>
      </div>

      {/* ------------------------------ TABLE ------------------------------ */}
      <div className="border border-white/10 rounded-[8px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-sm">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {placements.map((p) => (
              <tr
                key={p._id}
                className="border-t border-white/5 text-sm hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {p.userName}
                </td>

                <td className="px-4 py-3">
                  {p.company}
                </td>

                <td className="px-4 py-3">
                  {p.jobRole}
                </td>

                <td className="px-4 py-3">
                  ₹{p.package}
                </td>

                <td className="px-4 py-3 text-white/70">
                  {p.city}, {p.state}
                </td>

                <td className="px-4 py-3">
                  {p.modeOfWork ?? "-"}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {new Date(
                    p.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right space-x-3">
                  <button className="text-violet-400 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-400 hover:underline">
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
          Page {pagination.page} of{" "}
          {pagination.totalPages}
        </span>

        <button
          className="px-3 py-1 border border-white/10 rounded-[8px] disabled:opacity-40"
          disabled={page === pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function PageSkeleton() {
  return (
    <section className="p-6 space-y-4">
      <div className="h-8 w-48 bg-white/10 rounded-[8px]" />
      <div className="h-64 bg-white/10 rounded-[8px]" />
    </section>
  )
}

export default Placements
