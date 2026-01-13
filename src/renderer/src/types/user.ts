export interface UserProfile {
  _id: string
  name: string
  email: string
  phoneNumber: string
  bio: string
  address: string
  college: string
  avatar: string | null
  dob: string
  state: string
  city: string
  studentId: string
  role: "student" | "admin" | string
  isVerified: boolean
}

export interface GetProfileResponse {
  success: boolean
  user: UserProfile
}

export interface UpdateProfilePayload {
  name?: string
  bio?: string
  phone?: string
  address?: string
  college?: string
}
