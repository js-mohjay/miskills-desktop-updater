// pages/student/StudentLayout.tsx
import {Outlet} from "react-router";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/AppSidebar";


import {
  BriefcaseBusiness,
  Home,
  Library,
  Rocket, Video,
} from "lucide-react"


const sidebarData = {
  // navCollapsable: [
  //     {
  //         title: "Playground",
  //         url: "#",
  //         icon: SquareTerminal,
  //         isActive: true,
  //         items: [
  //             {
  //                 title: "History",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Starred",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Settings",
  //                 url: "#",
  //             },
  //         ],
  //     },
  //     {
  //         title: "Models",
  //         url: "#",
  //         icon: Bot,
  //         items: [
  //             {
  //                 title: "Genesis",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Explorer",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Quantum",
  //                 url: "#",
  //             },
  //         ],
  //     },
  //     {
  //         title: "Documentation",
  //         url: "#",
  //         icon: BookOpen,
  //         items: [
  //             {
  //                 title: "Introduction",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Get Started",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Tutorials",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Changelog",
  //                 url: "#",
  //             },
  //         ],
  //     },
  //     {
  //         title: "Settings",
  //         url: "#",
  //         icon: Settings2,
  //         items: [
  //             {
  //                 title: "General",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Team",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Billing",
  //                 url: "#",
  //             },
  //             {
  //                 title: "Limits",
  //                 url: "#",
  //             },
  //         ],
  //     },
  // ],

  navNonCollapsable: [
    {
      name: "Dashboard",
      url: "/student",
      icon: Home,
    },
    {
      name: "Courses",
      url: "/student/courses",
      icon: Library,
    },
    {
      name: "Learning",
      url: "/student/learning",
      icon: Rocket,
    },
    {
      name: "Placements",
      url: "/student/placements",
      icon: BriefcaseBusiness,
    },
    {
      name: "Meetings",
      url: "/student/meetings",
      icon: Video,
    },
  ],
}

export default function StudentLayout() {
  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData}/>
      <main className="flex-1">
        {/*<SidebarTrigger />*/}
        <Outlet/>
      </main>
    </SidebarProvider>
  );
}
