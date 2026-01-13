"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subAdminService } from "@/services/subAdmin.service";
import { SubAdmin } from "@/types/subAdmin";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: SubAdmin | null;
}

export default function SubAdminDialog({
  open,
  onClose,
  defaultValues,
}: Props) {
  const form = useForm({
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      phoneNumber: "",
      role: "training",
    },
  });

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: any) =>
      defaultValues
        ? subAdminService.update(defaultValues._id, values)
        : subAdminService.create(values),

    onSuccess: () => {
      toast.success(
        defaultValues
          ? "Sub admin updated successfully"
          : "Sub admin created successfully"
      );

      qc.invalidateQueries({ queryKey: ["sub-admins"] });
      handleClose();
    },

    onError: (error: AxiosError<any>) => {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    },
  });

  const handleClose = () => {
    form.reset();
    mutation.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="rounded-[8px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Sub Admin" : "Add Sub Admin"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="grid grid-cols-2 gap-4"
        >
          <Field label="Name" {...form.register("name")} />
          <Field label="Email" {...form.register("email")} />
          <Field label="Phone" {...form.register("phoneNumber")} />

          <div className="space-y-1">
            <label className="text-sm text-white/70">Role</label>
            <select
              {...form.register("role")}
              className="w-full rounded-[8px] bg-zinc-900 border border-white/10 p-2"
            >
              <option value="training">Training</option>
              <option value="placement">Placement</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end">
            <button className="btn-primary" disabled={mutation.isPending}>
              <span>
                {mutation.isPending
                  ? "Please wait..."
                  : defaultValues
                  ? "Update"
                  : "Create"}
              </span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-white/70">{label}</label>
      <input
        {...props}
        className="w-full rounded-[8px] bg-zinc-900 border border-white/10 p-2"
      />
    </div>
  );
}
