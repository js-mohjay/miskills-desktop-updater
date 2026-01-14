"use client"

import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { adminBatchService } from "@/services/admin.service"

import { useState } from "react"
import ScheduleMeetingDialog from "@/components/admin/batch/ScheduleMeetingDialog"

export default function BatchDetails() {
    const { batchId } = useParams()
    const [selectedLiveClass, setSelectedLiveClass] =
        useState<any>(null)

    const { data, isLoading } = useQuery({
        queryKey: ["admin-batch", batchId],
        enabled: !!batchId,
        queryFn: async () => {
            const res =
                await adminBatchService.getBatchById(batchId!)
            return res.data
        },
    })

    if (isLoading) return null

    const batch = data?.data?.batch
    const classes = data?.data?.classes || []

    return (
        <section className="p-6 space-y-6!">
            <h1 className="text-3xl font-semibold">
                {batch.name}
            </h1>

            <div className="border border-white/10 rounded-[8px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-4 py-3">S.No</th>
                            <th className="px-4 py-3">Day</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Start Time</th>
                            <th className="px-4 py-3">End Time</th>
                            <th className="px-4 py-3">Instructor</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {classes.map((c: any, idx: number) => (
                            <tr
                                key={c._id}
                                className="border-t border-white/5 hover:bg-white/5"
                            >
                                <td className="px-4 py-3">
                                    {idx + 1}
                                </td>
                                <td className="px-4 py-3">
                                    Day {c.day}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(c.date).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-3">
                                    {new Date(c.startDateTime).toLocaleTimeString("en-IN")}
                                </td>

                                <td className="px-4 py-3">
                                    {new Date(c.endDateTime).toLocaleTimeString("en-IN")}
                                </td>
                                <td className="px-4 py-3">
                                    {c.conductedByInstructor?.name}
                                </td>
                                <td className="px-4 py-3 capitalize">
                                    {c.status}
                                </td>

                                <td className="px-4 py-3 text-right  flex! justify-end! items-end! gap-2!">
                                    <button
                                        className="btn-primary"
                                        onClick={() =>
                                            setSelectedLiveClass(c)
                                        }
                                    >
                                        <span>Schedule Meeting</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedLiveClass && (
                <ScheduleMeetingDialog
                    open
                    liveClass={selectedLiveClass}
                    onClose={() => setSelectedLiveClass(null)}
                />
            )}
        </section>
    )
}
