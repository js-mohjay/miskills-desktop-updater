export type Instructor = {
  _id: string
  name: string
  email: string
  phoneNumber: string
  skills: string[]
  avatar: string | null
  bio: string
  isActive: boolean
  isVerified: boolean
  verificationRequested: boolean
  createdAt: string
}

export type InstructorListResponse = {
  success: boolean
  data: {
    instructors: Instructor[]
    pagination: {
      current: number
      total: number
      count: number
      limit: number
    }
  }
}
