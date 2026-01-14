"use client"

import { useParams, useLocation } from "react-router"
import { useQuery, useMutation } from "@tanstack/react-query"
import { attendanceService } from "@/services/attendance.service"
import { batchService } from "@/services/batch.service"
import { toast } from "sonner"
import AttendanceGrid from "@/components/attendance/AttendanceGrid"
import ConfirmEnrollDialog from "@/components/attendance/ConfirmEnrollDialog"
import { Loader } from "lucide-react"
import { useState } from "react"

/* -------------------------------------------------------------------------- */

export default function LearningDetails() {
  const { subcategoryId } = useParams()
  const location = useLocation()
  const subscriptionId = location.state?.subscriptionId

  const [selectedBatch, setSelectedBatch] = useState<any>(null)

  /* ---------------------------- Attendance API ---------------------------- */

  const {
    data: attendanceRes,
    isLoading: attendanceLoading,
  } = useQuery({
    queryKey: ["attendance", subcategoryId],
    queryFn: async () => {
      const res =
        await attendanceService.getBySubcategory(subcategoryId!)
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
      const res =
        await batchService.getActiveBatches(subcategoryId!)
      return res.data
    },
  })

  const batches = batchRes?.data ?? []

  /* ------------------------------ Enroll API ------------------------------ */

  const enrollMutation = useMutation({
    mutationFn: batchService.enrollInBatch,
    onSuccess: () => {
      toast.success("Batch enrolled successfully")
      setSelectedBatch(null)
    },
    onError: () => {
      toast.error("Failed to enroll in batch")
    },
  })

  /* -------------------------------------------------------------------------- */

  if (attendanceLoading) {
    return (
      <div className="p-10 text-xl text-white/70">
        Loading learning details...
      </div>
    )
  }

  /* ------------------------------ ATTENDANCE ------------------------------ */

  if (hasAttendance) {
    return (
      <section className="p-10 space-y-8!">
        <h1 className="text-4xl font-semibold">
          {attendance.batchName}
        </h1>

        <div className="grid grid-cols-4 gap-6">
          <Stat label="Total Classes" value={attendance.totalDays} />
          <Stat label="Attended" value={attendance.attendedDays} />
          <Stat label="Missed" value={attendance.missedDays} />
          <Stat
            label="Completion"
            value={`${attendance.completionPercentage}%`}
          />
        </div>

        <AttendanceGrid attendance={attendance.attendance} />
      </section>
    )
  }

  /* --------------------------- BATCH SELECTION --------------------------- */

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
    <section className="p-10 space-y-6!">
      <h2 className="text-3xl font-semibold">
        Choose a Batch to Enroll
      </h2>

      <div className="grid max-w-2xl gap-6">
        {batches.map((batch: any) => (
          <div
            key={batch._id}
            className="card border border-white/20 p-6 flex flex-row! justify-between items-center"
          >
            <div className="space-y-2!">
              <h3 className="text-2xl font-semibold">
                {batch.name}
              </h3>
              <p className="text-xl">
                Start Date: {new Date(batch.startDate).toLocaleDateString("en-IN")}{" "}
                –{" "}
                End Date: {new Date(batch.endDate).toLocaleDateString("en-IN")}
              </p>
              <p className="text-xl">
                Timings: {batch.startTime} – {batch.endTime}
              </p>
              <p className="text-xl">
                Instructor: {batch.assignedInstructor.name}
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => setSelectedBatch(batch)}
            >
              <span>Enroll Now</span>
            </button>
          </div>
        ))}
      </div>

      {selectedBatch && (
        <ConfirmEnrollDialog
          open
          batch={selectedBatch}
          loading={enrollMutation.isPending}
          onCancel={() => setSelectedBatch(null)}
          onConfirm={() =>
            enrollMutation.mutate({
              subscriptionId,
              batchId: selectedBatch._id,
            })
          }
        />
      )}
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="card p-4 border border-white/20 text-center">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-white/60">{label}</p>
    </div>
  )
}
