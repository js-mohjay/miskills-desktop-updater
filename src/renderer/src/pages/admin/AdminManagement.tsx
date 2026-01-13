"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subAdminService } from "@/services/subAdmin.service";
import { SubAdminListResponse, SubAdmin } from "@/types/subAdmin";
import SubAdminTable from "@/components/admin/sub-admin/SubAdminTable";
import SubAdminDialog from "@/components/admin/sub-admin/SubAdminDialog";
import ConfirmDeleteAlert from "@/components/common/ConfirmDeleteAlert";


export default function AdminManagement() {
    const [page] = useState(1);
    const limit = 10;

    const [openDialog, setOpenDialog] = useState(false);
    const [editAdmin, setEditAdmin] = useState<SubAdmin | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const qc = useQueryClient();

    const { data, isLoading, isError } = useQuery<SubAdminListResponse>({
        queryKey: ["sub-admins", page, limit],
        queryFn: async () => {
            const res = await subAdminService.getAll(page, limit);
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => subAdminService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["sub-admins"] });
            setDeleteId(null);
        },
    });

    if (isLoading) return <PageSkeleton />;

    if (isError || !data?.success) {
        return (
            <section className="p-6">
                <p className="text-red-400">Failed to load sub admins</p>
            </section>
        );
    }

    return (
        <section className="p-6 space-y-6!">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Admin Management</h1>

                <button
                    className="btn-primary"
                    onClick={() => {
                        setEditAdmin(null);
                        setOpenDialog(true);
                    }}
                >
                    <span>+ Add Admin</span>
                </button>
            </div>

            <SubAdminTable
                admins={data.data.admins}
                onEdit={(a) => {
                    setEditAdmin(a);
                    setOpenDialog(true);
                }}
                onDelete={(id) => setDeleteId(id)}
            />

            {/* Dialogs */}
            <SubAdminDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                defaultValues={editAdmin}
            />

            <ConfirmDeleteAlert
                open={!!deleteId}
                onCancel={() => setDeleteId(null)}
                onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
            />
        </section>
    );
}

function PageSkeleton() {
    return (
        <section className="p-6 space-y-4!">
            <div className="h-8 w-48 bg-white/10 rounded-[8px]" />
            <div className="h-64 bg-white/10 rounded-[8px]" />
        </section>
    );
}
