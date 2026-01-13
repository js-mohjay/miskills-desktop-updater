import { Outlet } from "react-router"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import {
  Home,
  Users,
  Layers,
  Grid3X3,
  AlertTriangle,
} from "lucide-react"

const adminSidebarData = {
  navNonCollapsable: [
    {
      name: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      name: "Admin Management",
      url: "/admin/admin-management",
      icon: Home,
    },
    {
      name: "Student Management",
      url: "/admin/student-management",
      icon: Home,
    },
    {
      name: "Instructors",
      url: "/admin/instructors",
      icon: Users,
    },
    {
      name: "Batches",
      url: "/admin/batches",
      icon: Layers,
    },
    {
      name: "Categories",
      url: "/admin/categories",
      icon: Grid3X3,
    },
    {
      name: "Missed Classes",
      url: "/admin/missed-classes",
      icon: AlertTriangle,
    },
    {
      name: "Job Applications",
      url: "/admin/job-applications",
      icon: Home,
    },
    {
      name: "Career Support",
      url: "/admin/career-support",
      icon: Home,
    },
  ],
  showAd: false
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar data={adminSidebarData} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
