"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { adminBatchService } from "@/services/admin.service"
import { Loader } from "lucide-react"

type Props = {
    open: boolean
    liveClass: any
    onClose: () => void
}

export default function ScheduleMeetingDialog({
    open,
    liveClass,
    onClose,
}: Props) {
    const form = useForm({
        defaultValues: { topic: "" },
    })

    const mutation = useMutation({
        mutationFn: (payload: {
            liveClassId: string
            topic: string
        }) =>
            adminBatchService.scheduleMeeting(payload),
        onSuccess: onClose,
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-black border border-violet-500/30">
                <DialogHeader>
                    <DialogTitle className="text-2xl!">
                        Schedule Meeting
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit((v) =>
                        mutation.mutate({
                            liveClassId: liveClass._id,
                            topic: v.topic,
                        })
                    )}
                    className="space-y-4!"
                >
                    <input
                        {...form.register("topic", {
                            required: true,
                        })}
                        placeholder="Meeting topic"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white"
                    />

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        <span className="btn-primary flex items-center gap-2">
                            <span>
                                {mutation.isPending ? (
                                    <Loader className={"size-6 animate-spin"} />
                                ) : "Schedule"}
                            </span>
                        </span>
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
