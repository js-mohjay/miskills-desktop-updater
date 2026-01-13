export type AdminDashboardResponse = {
  success: boolean
  data: {
    overview: {
      totalUsers: number
      totalStudents: number
      totalInstructors: number
      totalEventOrganizers: number
      totalSubscriptions: number
      activeSubscriptions: number
      monthlySubscriptions: number
      totalRevenue: number
      monthlyRevenue: number
    }
    recentActivity: {
      newUsers: {
        _id: string
        name: string
        email: string
        role: string
        createdAt: string
      }[]
      recentPayments: {
        _id: string
        user: {
          name: string
          email: string
        }
        amount: number
        currency: string
        createdAt: string
      }[]
    }
    analytics: {
      userGrowth: {
        _id: {
          year: number
          month: number
        }
        count: number
      }[]
      revenueGrowth: {
        _id: {
          year: number
          month: number
        }
        revenue: number
        transactions: number
      }[]
    }
  }
}
