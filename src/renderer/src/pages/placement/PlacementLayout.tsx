import { Outlet } from "react-router"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import {
  Briefcase,
  LayoutDashboard,
} from "lucide-react"

/* -------------------------------------------------------------------------- */

const placementSidebarData = {
  navNonCollapsable: [
    {
      name: "Dashboard",
      url: "/placement-admin",
      icon: LayoutDashboard,
    },
    {
      name: "Career Support",
      url: "/placement-admin/career-support",
      icon: Briefcase,
    },
  ],
}

/* -------------------------------------------------------------------------- */

export default function PlacementLayout() {
  return (
    <SidebarProvider>
      <AppSidebar data={placementSidebarData} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
