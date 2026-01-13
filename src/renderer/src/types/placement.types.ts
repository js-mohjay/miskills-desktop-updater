export type Placement = {
  _id: string
  userId: string
  userName: string
  company: string
  jobRole: string
  offerType?: string
  status?: string
  package: number
  state: string
  city: string
  modeOfWork?: string
  createdAt: string
}

export type PlacementListResponse = {
  success: boolean
  data: Placement[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
