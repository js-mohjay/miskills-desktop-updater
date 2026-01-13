"use client"

import { useParams, useLocation } from "react-router"
import { useQuery, useMutation } from "@tanstack/react-query"
import { attendanceService } from "@/services/attendance.service"
import { batchService } from "@/services/batch.service"
import { toast } from "sonner"
import AttendanceGrid from "@/components/attendance/AttendanceGrid"

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type AttendanceResponse = {
    success: boolean
    data: {
        batchName: string | null
        startDate: string
        endDate: string
        totalDays: number
        attendedDays: number
        missedDays: number
        completionPercentage: number
        attendance: any[]
    }
}

type Batch = {
    _id: string
    name: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    assignedInstructor: {
        name: string
        email: string
    }
}

/* -------------------------------------------------------------------------- */

export default function LearningDetails() {
    const { subcategoryId } = useParams()
    const location = useLocation()
    const subscriptionId = location.state?.subscriptionId

    /* ---------------------------- Attendance API ---------------------------- */

    const {
        data: attendanceRes,
        isLoading: attendanceLoading,
    } = useQuery<AttendanceResponse>({
        queryKey: ["attendance", subcategoryId],
        queryFn: async () => {
            const res = await attendanceService.getBySubcategory(subcategoryId!)
            return res.data
        },
    })

    const attendance = attendanceRes?.data
    const hasAttendance =
        attendance &&
        attendance.batchName &&
        attendance.attendance.length > 0

    /* -------------------------- Active Batches API -------------------------- */

    const {
        data: batchRes,
        isLoading: batchLoading,
    } = useQuery({
        queryKey: ["active-batches", subcategoryId],
        enabled: !!attendance && !hasAttendance,
        queryFn: async () => {
            const res = await batchService.getActiveBatches(subcategoryId!)
            return res.data
        },
    })

    const batches: Batch[] = batchRes?.data ?? []

    /* ------------------------------ Enroll API ------------------------------ */

    const enrollMutation = useMutation({
        mutationFn: batchService.enrollInBatch,
        onSuccess: () => {
            toast.success("Batch enrolled successfully")
        },
        onError: () => {
            toast.error("Failed to enroll in batch")
        },
    })

    /* -------------------------------------------------------------------------- */
    /*                                   STATES                                   */
    /* -------------------------------------------------------------------------- */

    if (attendanceLoading) {
        return (
            <div className="p-10 text-xl text-white/70">
                Loading learning details...
            </div>
        )
    }

    /* -------------------------------------------------------------------------- */
    /*                               ATTENDANCE UI                                */
    /* -------------------------------------------------------------------------- */

    if (hasAttendance) {
        return (
            <section className="p-10 space-y-8!">
                <h1 className="text-4xl font-semibold">
                    {attendance.batchName}
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6">
                    <Stat label="Total Classes" value={attendance.totalDays} />
                    <Stat label="Attended" value={attendance.attendedDays} />
                    <Stat label="Missed" value={attendance.missedDays} />
                    <Stat
                        label="Completion"
                        value={`${attendance.completionPercentage}%`}
                    />
                </div>

                {/* Attendance Grid */}
                <div className="space-y-4!">
                    <h2 className="text-2xl font-semibold mb-4">
                        Attendance Overview:
                    </h2>

                    <AttendanceGrid
                        attendance={attendance.attendance}
                    />
                </div>
            </section>
        )
    }

    /* -------------------------------------------------------------------------- */
    /*                         NO ATTENDANCE → BATCH UI                            */
    /* -------------------------------------------------------------------------- */

    if (batchLoading) {
        return (
            <div className="p-10 text-xl text-white/70">
                Checking available batches...
            </div>
        )
    }

    if (batches.length === 0) {
        return (
            <section className="p-10">
                <h2 className="text-3xl mb-4">
                    No active batches available
                </h2>
                <p className="text-white/70">
                    Please wait for the next batch announcement.
                </p>
            </section>
        )
    }

    return (
        <section className="p-10 space-y-6">
            <h2 className="text-3xl font-semibold">
                Choose a Batch to Enroll
            </h2>

            <div className="grid gap-6">
                {batches.map((batch) => (
                    <div
                        key={batch._id}
                        className="card border border-white/20 p-6 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="text-2xl font-semibold">
                                {batch.name}
                            </h3>
                            <p className="text-white/70">
                                {batch.startTime} - {batch.endTime}
                            </p>
                            <p className="text-white/60">
                                Instructor: {batch.assignedInstructor.name}
                            </p>
                        </div>

                        <button
                            className="btn-primary"
                            disabled={enrollMutation.isPending}
                            onClick={() =>
                                enrollMutation.mutate({
                                    subscriptionId,
                                    batchId: batch._id,
                                })
                            }
                        >
                            Enroll
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

/* -------------------------------------------------------------------------- */
/*                               SMALL COMPONENT                               */
/* -------------------------------------------------------------------------- */

function Stat({ label, value }: { label: string; value: any }) {
    return (
        <div className="card p-4 border border-white/20 text-center">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-white/60">{label}</p>
        </div>
    )
}
