"use client"

import { useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

import {
    adminBatchService,
    adminInstructorService,
} from "@/services/admin.service"

/* -------------------------------------------------------------------------- */

type Mode = "add" | "edit"

type Props = {
    open: boolean
    onClose: () => void
    mode: Mode
    batch?: any
}

/* -------------------------------------------------------------------------- */

const inputBase =
    "w-full px-3 py-2 bg-black/40 border border-white/10 rounded-[8px] text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"

/* -------------------------------------------------------------------------- */

export default function BatchDialog({
    open,
    onClose,
    mode,
    batch,
}: Props) {
    const isEdit = mode === "edit"
    const queryClient = useQueryClient()

    /* --------------------------- INSTRUCTORS LIST --------------------------- */

    const { data: instructorsRes } = useQuery({
        queryKey: ["admin-instructors-dropdown"],
        queryFn: async () => {
            const res =
                await adminInstructorService.getInstructors(
                    1,
                    100
                )
            return res.data
        },
    })

    const instructors =
        instructorsRes?.data?.instructors || []

    /* ------------------------------- FORM ---------------------------------- */

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            subcategoryId: "",
            assignedInstructor: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
        },
    })

    useEffect(() => {
        if (batch) {
            form.reset({
                name: batch.name,
                description: batch.description || "",
                subcategoryId: batch.subcategoryId?._id || "",
                assignedInstructor:
                    batch.assignedInstructor?._id ??
                    batch.assignedInstructor ??
                    "",
                startDate: batch.startDate?.slice(0, 10),
                endDate: batch.endDate?.slice(0, 10),
                startTime: batch.startTime,
                endTime: batch.endTime,
            })
        }
    }, [batch, form])

    /* ------------------------------ MUTATION ------------------------------- */

    const mutation = useMutation({
        mutationFn: (values: any) =>
            isEdit
                ? adminBatchService.updateBatch(
                    batch._id,
                    values
                )
                : adminBatchService.createBatch(values),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-batches"],
            })
            onClose()
        },
    })

    /* ------------------------------------------------------------------------ */

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-[8px] bg-black border border-violet-500/30 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {isEdit ? "Edit Batch" : "Create Batch"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit((v) =>
                        mutation.mutate(v)
                    )}
                    className="grid grid-cols-2 gap-4 mt-2"
                >
                    {/* ------------------------------ NAME ------------------------------ */}
                    <Input
                        label="Name"
                        {...form.register("name")}
                    />

                    {/* -------------------------- SUBCATEGORY --------------------------- */}
                    <div className="space-y-1">
                        <label className="text-sm text-white/70">
                            Subcategory
                        </label>
                        <input
                            value={batch?.subcategoryId?.name || ""}
                            disabled
                            className={`${inputBase} opacity-70`}
                        />
                    </div>

                    {/* --------------------------- DESCRIPTION -------------------------- */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-sm text-white/70">
                            Description
                        </label>
                        <textarea
                            {...form.register("description")}
                            rows={3}
                            className={`${inputBase} resize-none`}
                            placeholder="Enter batch description"
                        />
                    </div>


                    

                    {/* -------------------------- INSTRUCTOR ---------------------------- */}
                    <div className="space-y-1">
                        <label className="text-sm text-white/70">
                            Instructor
                        </label>

                        <Select
                            value={form.watch("assignedInstructor")}
                            onValueChange={(v) =>
                                form.setValue(
                                    "assignedInstructor",
                                    v
                                )
                            }
                        >
                            <SelectTrigger
                                className={`${inputBase} flex justify-between py-5!`}
                            >
                                <SelectValue placeholder="Select Instructor" />
                            </SelectTrigger>

                            <SelectContent className="bg-black border border-violet-500/30 rounded-[8px] text-white">
                                {instructors.map((inst: any) => (
                                    <SelectItem
                                        key={inst._id}
                                        value={inst._id}
                                        className="focus:bg-violet-500/20 focus:text-white"
                                    >
                                        {inst.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ---------------------------- DATES ------------------------------- */}
                    <Input
                        type="date"
                        label="Start Date"
                        {...form.register("startDate")}
                    />

                    <Input
                        type="date"
                        label="End Date"
                        {...form.register("endDate")}
                    />

                    {/* ---------------------------- TIMES ------------------------------- */}
                    <Input
                        type="time"
                        label="Start Time"
                        {...form.register("startTime")}
                    />

                    <Input
                        type="time"
                        label="End Time"
                        {...form.register("endTime")}
                    />

                    {/* ----------------------------- ACTION ----------------------------- */}
                    <div className="col-span-2 flex justify-end mt-4">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={mutation.isPending}
                        >
                            <span>
                                {isEdit ? "Update" : "Create"}
                            </span>
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

/* -------------------------------------------------------------------------- */
/*                                  INPUT                                     */
/* -------------------------------------------------------------------------- */

function Input({
    label,
    type = "text",
    ...props
}: any) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-white/70">
                {label}
            </label>
            <input
                type={type}
                {...props}
                className={`${inputBase}
          [color-scheme:dark]
          [&::-webkit-calendar-picker-indicator]:invert
          [&::-webkit-calendar-picker-indicator]:opacity-70
        `}
            />
        </div>
    )
}
