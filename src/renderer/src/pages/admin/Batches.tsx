"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminBatchService } from "@/services/admin.service"
import BatchDialog from "@/components/admin/batch/BatchDialog"
import ConfirmDeleteAlert from "@/components/common/ConfirmDeleteAlert"
import { Link } from "react-router"

const Batches = () => {
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ["admin-batches", page],
    queryFn: async () => {
      const res = await adminBatchService.getBatches(page, 10)
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminBatchService.deleteBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-batches"],
      })
      setDeleteId(null)
    },
  })

  const batches = data?.data || []

  return (
    <section className="p-6 space-y-6!">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Batches</h1>

        <button
          className="btn-primary"
          onClick={() => setDialog({ type: "add" })}
        >
          <span>+ Add Batch</span>
        </button>
      </div>

      <div className="border border-white/10 rounded-[8px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Subcategory</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Start Time</th>
              <th className="px-4 py-3">End Time</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((b: any) => (
              <tr
                key={b._id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3 font-medium">{b.name}</td>

                <td className="px-4 py-3 text-white/70">
                  {b.subcategoryId?.name}
                </td>

                <td className="px-4 py-3">
                  {b.assignedInstructor?.name}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {new Date(b.startDate).toLocaleDateString()} →{" "}
                  {new Date(b.endDate).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {b.startTime}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {b.endTime}
                </td>

                <td className="px-4 py-3 text-right space-x-3!">
                  <Link
                    to={`/admin/batches/${b._id}`}
                    className="text-violet-400 hover:underline"
                  >
                    View
                  </Link>

                  <button
                    className="text-blue-400 hover:underline"
                    onClick={() =>
                      setDialog({ type: "edit", batch: b })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-400 hover:underline"
                    onClick={() => setDeleteId(b._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dialog && (
        <BatchDialog
          open
          mode={dialog.type}
          batch={dialog.batch}
          onClose={() => setDialog(null)}
        />
      )}

      {deleteId && (
        <ConfirmDeleteAlert
          open
          title="Delete Batch?"
          description="This will permanently delete the batch."
          onCancel={() => setDeleteId(null)}
          onConfirm={() =>
            deleteMutation.mutate(deleteId)
          }
        />
      )}
    </section>
  )
}

export default Batches
