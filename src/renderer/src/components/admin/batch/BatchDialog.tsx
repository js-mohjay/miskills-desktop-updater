"use client"

import { useEffect, useState } from "react"
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
    adminCategoryService,
    adminInstructorService,
} from "@/services/admin.service"
import { CategoryListResponse } from "@/types/admin.category"
import { Loader } from "lucide-react"

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

    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")

    const [categoryOptions, setCategoryOptions] = useState<
        { label: string; value: string }[]
    >([])

    const [subcategoryOptions, setSubcategoryOptions] = useState<
        { label: string; value: string }[]
    >([])

    /* ---------------------------- CATEGORIES ---------------------------- */

    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useQuery<CategoryListResponse>({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const res = await adminCategoryService.getCategories()
            return res.data
        },
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (categoriesData?.data?.categories?.length) {
            setCategoryOptions(
                categoriesData.data.categories.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                }))
            )

            if (isEdit && batch?.subcategoryId?.categoryId) {
                setSelectedCategory(batch.subcategoryId.categoryId)
            }
        }
    }, [categoriesData, isEdit, batch])

    /* -------------------------- SUBCATEGORIES --------------------------- */

    const {
        data: subcategoriesData,
        isLoading: isSubcategoriesLoading,
    } = useQuery({
        queryKey: ["admin-subcategories", selectedCategory],
        enabled: !!selectedCategory,
        queryFn: async () => {
            const res =
                await adminCategoryService.getSubcategories(
                    selectedCategory
                )
            return res.data
        },
    })

    useEffect(() => {
        if (subcategoriesData?.data?.subcategories) {
            setSubcategoryOptions(
                subcategoriesData.data.subcategories.map(
                    (sub: any) => ({
                        label: sub.name,
                        value: sub._id,
                    })
                )
            )

            if (isEdit && batch?.subcategoryId?._id) {
                setSelectedSubcategory(batch.subcategoryId._id)
                form.setValue(
                    "subcategoryId",
                    batch.subcategoryId._id
                )
            }
        } else {
            setSubcategoryOptions([])
        }
    }, [subcategoriesData, isEdit, batch])

    /* --------------------------- INSTRUCTORS ---------------------------- */

    const { data: instructorsRes } = useQuery({
        queryKey: ["admin-instructors-dropdown"],
        queryFn: async () => {
            const res = await adminInstructorService.getInstructors(
                1,
                100
            )
            return res.data
        },
    })

    const instructors =
        instructorsRes?.data?.instructors || []

    /* ------------------------------- FORM -------------------------------- */

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

    /* ------------------------------ MUTATION ----------------------------- */

    const mutation = useMutation({
        mutationFn: (values: any) =>
            isEdit
                ? adminBatchService.updateBatch(batch._id, values)
                : adminBatchService.createBatch(values),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-batches"],
            })
            onClose()
        },
    })

    /* -------------------------------------------------------------------- */

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
                    <Input label="Name" {...form.register("name")} />

                    {/* ---------------------------- CATEGORY ---------------------------- */}
                    <div className="space-y-1">
                        <label className="text-sm text-white/70">
                            Category
                        </label>

                        <Select
                            value={selectedCategory}
                            onValueChange={(v) => {
                                setSelectedCategory(v)
                                setSelectedSubcategory("")
                                setSubcategoryOptions([])
                                form.setValue("subcategoryId", "")
                            }}
                            disabled={isCategoriesLoading || isCategoriesError}
                        >
                            <SelectTrigger className="w-full! py-5! bg-[#222020] border border-gray-700 rounded-[8px]">
                                <SelectValue
                                    placeholder={
                                        isCategoriesLoading
                                            ? "Loading categories..."
                                            : "Select Category"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="bg-[#181b1d] border border-white/10">
                                {categoryOptions.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* -------------------------- SUBCATEGORY --------------------------- */}
                    <div className="space-y-1">
                        <label className="text-sm text-white/70">
                            Subcategory
                        </label>

                        <Select
                            value={selectedSubcategory}
                            onValueChange={(v) => {
                                setSelectedSubcategory(v)
                                form.setValue("subcategoryId", v)
                            }}
                            disabled={
                                !selectedCategory ||
                                isSubcategoriesLoading
                            }
                        >
                            <SelectTrigger className="w-full! py-5! bg-[#222020] border border-gray-700 rounded-[8px]">
                                <SelectValue
                                    placeholder={
                                        isSubcategoriesLoading
                                            ? "Loading subcategories..."
                                            : "Select Subcategory"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="bg-[#181b1d] border border-white/10">
                                {subcategoryOptions.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                className={`${inputBase} py-5!`}
                            >
                                <SelectValue placeholder="Select Instructor" />
                            </SelectTrigger>

                            <SelectContent className="bg-black border border-violet-500/30">
                                {instructors.map((inst: any) => (
                                    <SelectItem
                                        key={inst._id}
                                        value={inst._id}
                                    >
                                        {inst.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                        />
                    </div>



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

                    <div className="col-span-2 flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="relative"
                        >
                            <span className="btn-primary flex items-center gap-2">
                                <span>
                                    {mutation.isPending ? (
                                        <Loader className="size-6 animate-spin" />
                                    ) : (
                                        isEdit ? "Update" : "Create"
                                    )}
                                </span>
                            </span>
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}

/* -------------------------------------------------------------------------- */

function Input({ label, type = "text", ...props }: any) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-white/70">
                {label}
            </label>
            <input
                type={type}
                {...props}
                className={`${inputBase}
          [color-scheme:light]
          [&::-webkit-calendar-picker-indicator]:invert
          [&::-webkit-calendar-picker-indicator]:opacity-70
          `}
            />
        </div>
    )
}
