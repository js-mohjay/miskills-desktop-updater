/* -------------------------------------------------------------------------- */
/*                           MISSED CLASSES LIST                               */
/* -------------------------------------------------------------------------- */

export type MissedClass = {
  day: number
  date: string
  liveClassId: string
  batchId: string
  batchName: string
  subcategoryId: string
  subcategoryName: string
}

export type MissedStudent = {
  userId: string
  name: string
  email: string
  missedCount: number
  missedClasses: MissedClass[]
}

export type MissedStudentsResponse = {
  success: boolean
  data: MissedStudent[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/* -------------------------------------------------------------------------- */
/*                           RECOVERY BATCHES                                  */
/* -------------------------------------------------------------------------- */

export type RecoveryBatch = {
  _id: string
  name: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}
