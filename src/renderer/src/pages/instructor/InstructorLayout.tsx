// pages/instructor/InstructorLayout.tsx
"use client";

import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Video } from "lucide-react";

const instructorSidebarData = {
  navNonCollapsable: [
    {
      name: "Meetings",
      url: "/instructor/meetings",
      icon: Video,
    },
  ],
};

export default function InstructorLayout() {
  return (
    <SidebarProvider>
      <AppSidebar data={instructorSidebarData} />

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
