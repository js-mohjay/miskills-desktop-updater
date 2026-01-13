"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import clsx from "clsx"

/* -------------------------------------------------------------------------- */

type AttendanceDay = {
    day: number
    date: string
    attended: boolean
    missed: boolean
    attended_time: number
    total_time: number
    liveClass: {
        startDateTime: string
        endDateTime: string
        status: "upcoming" | "completed" | "cancelled"
        instructor: {
            name: string
            email: string
        }
    }
    notes: any[]
}

/* -------------------------------------------------------------------------- */

function DetailItem({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="space-y-1">
            <p className="text-base text-white/80">{label}:</p>
            <p className="text-lg font-medium">{value}</p>
        </div>
    )
}



export default function AttendanceGrid({
    attendance,
}: {
    attendance: AttendanceDay[]
}) {
    const [selectedDay, setSelectedDay] =
        useState<AttendanceDay | null>(null)

    return (
        <>
            {/* ----------------------------- GRID ----------------------------- */}
            <div className="grid grid-cols-12 gap-4">
                {attendance.map((item) => {
                    const isUpcoming = item.liveClass.status === "upcoming"
                    const isAttended = item.attended
                    const isMissed = item.missed

                    const cardColor = clsx(
                        "cursor-pointer rounded-[8px] p-2 text-center border transition",
                        {
                            "bg-violet-800/20 border-violet-500 text-violet-300":
                                isUpcoming,
                            "bg-green-600/20 border-green-500 text-green-300":
                                isAttended,
                            "bg-red-600/20 border-red-500 text-red-300":
                                isMissed,
                            "bg-gray-700/30 border-gray-600 text-gray-300":
                                !isUpcoming && !isAttended && !isMissed,
                        }
                    )

                    return (
                        <div
                            key={item.day}
                            className={cardColor}
                            onClick={() => setSelectedDay(item)}
                        >
                            <p className="text-lg">Day</p>
                            <p className="text-2xl font-semibold">
                                {item.day}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* ----------------------------- MODAL ----------------------------- */}
            <Dialog
                open={!!selectedDay}
                onOpenChange={() => setSelectedDay(null)}
            >
                <DialogContent className="max-w-2xl p-8">
                    {selectedDay && (
                        <>
                            {/* -------------------- HEADER -------------------- */}
                            <DialogHeader className="space-y-2">
                                <DialogTitle className="text-2xl font-semibold">
                                    Day {selectedDay.day} Session Details
                                </DialogTitle>

                                <p className="text-white/60">
                                    {selectedDay.date}
                                </p>
                            </DialogHeader>

                            {/* -------------------- STATUS -------------------- */}
                            <div className="mt-6">
                                <span
                                    className={clsx(
                                        "inline-block px-3 py-1 rounded-full text-sm font-medium border",
                                        {
                                            "bg-green-600/20 border-green-500 text-green-300":
                                                selectedDay.attended,
                                            "bg-red-600/20 border-red-500 text-red-300":
                                                selectedDay.missed,
                                            "bg-violet-600/20 border-violet-500 text-violet-300":
                                                !selectedDay.attended && !selectedDay.missed,
                                        }
                                    )}
                                >
                                    {selectedDay.attended
                                        ? "Attended"
                                        : selectedDay.missed
                                            ? "Absent"
                                            : "Upcoming"}
                                </span>
                            </div>

                            {/* -------------------- INFO GRID -------------------- */}
                            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
                                <DetailItem
                                    label="Class Time"
                                    value={`${formatTime(
                                        selectedDay.liveClass.startDateTime
                                    )} – ${formatTime(
                                        selectedDay.liveClass.endDateTime
                                    )}`}
                                />

                                <DetailItem
                                    label="Instructor"
                                    value={selectedDay.liveClass.instructor.name}
                                />

                                <DetailItem
                                    label="Attended Time"
                                    value={`${selectedDay.attended_time} minutes`}
                                />

                                <DetailItem
                                    label="Total Duration"
                                    value={`${selectedDay.total_time} minutes`}
                                />
                            </div>

                            {/* -------------------- NOTES -------------------- */}
                            <div className="mt-10">
                                <h3 className="text-xl font-semibold mb-3">
                                    Notes
                                </h3>

                                {selectedDay.notes.length > 0 ? (
                                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
                                        {selectedDay.notes.map((note, idx) => (
                                            <p
                                                key={idx}
                                                className="text-white/70 text-sm"
                                            >
                                                • {note}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white text-sm">
                                        No notes available for this session.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </>
    )
}

/* -------------------------------------------------------------------------- */
/*                                HELPERS                                     */
/* -------------------------------------------------------------------------- */

function InfoRow({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="flex justify-between border-b border-white/10 pb-1">
            <span className="text-white/60">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    })
}
