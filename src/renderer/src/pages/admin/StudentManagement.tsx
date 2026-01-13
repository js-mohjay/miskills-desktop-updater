"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { StudentListResponse, Student } from "@/types/student";
import StudentTable from "@/components/admin/students/StudentTable";
import EditStudentDialog from "@/components/admin/students/EditStudentDialog";
import ConfirmDeleteAlert from "@/components/common/ConfirmDeleteAlert";


export default function StudentManagement() {
  const [page] = useState(1);
  const limit = 10;

  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const qc = useQueryClient();

  const { data, isLoading } = useQuery<StudentListResponse>({
    queryKey: ["students", page, limit],
    queryFn: async () => {
      const res = await studentService.getAll(page, limit);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      setDeleteId(null);
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
      <h1 className="text-3xl font-semibold">Student Management</h1>

      <StudentTable
        students={data?.data.students ?? []}
        onEdit={(s) => setEditStudent(s)}
        onDelete={(id) => setDeleteId(id)}
      />

      <EditStudentDialog
        open={!!editStudent}
        student={editStudent}
        onClose={() => setEditStudent(null)}
      />

      <ConfirmDeleteAlert
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </section>
  );
}
