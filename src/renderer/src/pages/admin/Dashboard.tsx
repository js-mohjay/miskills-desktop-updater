"use client"

import { useQuery } from "@tanstack/react-query"

import { AdminDashboardResponse } from "@/types/admin.dashboard"
import DashboardSkeleton from "@/components/admin/DashboardSkeleton"
import { adminDashboardService } from "@/services/admin.service"
import { StatCard } from "@/components/admin/StatCard"

/* -------------------------------------------------------------------------- */

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery<AdminDashboardResponse>({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await adminDashboardService.getStats()
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !data?.success) {
    return (
      <section className="p-6">
        <p className="text-red-400">
          Failed to load admin dashboard
        </p>
      </section>
    )
  }

  const { overview, recentActivity } = data.data

  return (
    <section className="w-full p-6 space-y-10!">
      {/* ----------------------------- HEADER ----------------------------- */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-white/60 mt-1">
          Platform overview & recent activity
        </p>
      </div>

      {/* ----------------------------- OVERVIEW ----------------------------- */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard label="Total Users" value={overview.totalUsers} />
        <StatCard label="Students" value={overview.totalStudents} />
        <StatCard label="Instructors" value={overview.totalInstructors} />
        <StatCard
          label="Active Subscriptions"
          value={overview.activeSubscriptions}
        />

        <StatCard
          label="Total Revenue"
          value={`₹${overview.totalRevenue}`}
        />
        <StatCard
          label="Monthly Revenue"
          value={`₹${overview.monthlyRevenue}`}
        />
        <StatCard
          label="Monthly Subscriptions"
          value={overview.monthlySubscriptions}
        />
        <StatCard
          label="Total Subscriptions"
          value={overview.totalSubscriptions}
        />
      </div>

      {/* ------------------------- RECENT ACTIVITY -------------------------- */}
      <div className="grid grid-cols-2 gap-8">
        {/* -------------------- NEW USERS -------------------- */}
        <div className="border border-white/10 rounded-[8px] p-5">
          <h2 className="text-lg font-semibold mb-4">
            New Users
          </h2>

          <div className="space-y-3">
            {recentActivity.newUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-start text-sm border-b border-white/5 pb-2"
              >
                <div>
                  <p className="font-medium text-base">
                    {user.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    {user.email}
                  </p>
                </div>

                <span className="text-white/50 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------- RECENT PAYMENTS -------------------- */}
        <div className="border border-white/10 rounded-[8px] p-5">
          <h2 className="text-lg font-semibold mb-4">
            Recent Payments
          </h2>

          <div className="space-y-3">
            {recentActivity.recentPayments.map((payment) => (
              <div
                key={payment._id}
                className="flex justify-between items-start text-sm border-b border-white/5 pb-2"
              >
                <div>
                  <p className="font-medium text-base">
                    {payment.user.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    {payment.user.email}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-base">
                    ₹{payment.amount}
                  </p>
                  <p className="text-white/50 text-sm">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

}

export default Dashboard
