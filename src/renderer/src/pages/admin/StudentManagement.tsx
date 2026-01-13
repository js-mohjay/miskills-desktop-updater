"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { studentService } from "@/services/student.service"
import { StudentListResponse, Student } from "@/types/student"
import StudentTable from "@/components/admin/students/StudentTable"
import EditStudentDialog from "@/components/admin/students/EditStudentDialog"
import ConfirmDeleteAlert from "@/components/common/ConfirmDeleteAlert"

export default function StudentManagement() {
  const [page, setPage] = useState(1)
  const limit = 10

  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const qc = useQueryClient()

  const { data, isLoading } = useQuery<StudentListResponse>({
    queryKey: ["students", page, limit],
    queryFn: async () => {
      const res = await studentService.getAll(page, limit)
      return res.data
    },
    placeholderData: keepPreviousData
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] })
      setDeleteId(null)
    },
  })

  if (isLoading) {
    return (
      <section className="p-6">
        <div className="h-64 bg-white/10 rounded-[8px]" />
      </section>
    )
  }

  const students = data?.data.students ?? []
  const pagination = data?.data.pagination

  const totalPages =
    pagination?.total ??
    Math.ceil((pagination?.total ?? 0) / limit)

  return (
    <section className="p-6 space-y-6!">
      <h1 className="text-3xl font-semibold">
        Student Management
      </h1>

      <StudentTable
        students={students}
        onEdit={(s) => setEditStudent(s)}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* --------------------------- PAGINATION --------------------------- */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3">
          <button
            className="px-3 py-1 border border-white/10 rounded-[8px]
                       disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span className="text-sm text-white/60">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-3 py-1 border border-white/10 rounded-[8px]
                       disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* --------------------------- DIALOGS --------------------------- */}
      <EditStudentDialog
        open={!!editStudent}
        student={editStudent}
        onClose={() => setEditStudent(null)}
      />

      <ConfirmDeleteAlert
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() =>
          deleteId && deleteMutation.mutate(deleteId)
        }
      />
    </section>
  )
}
