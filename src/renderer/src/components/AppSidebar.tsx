"use client"

import { ComponentProps } from "react"
import { NavCollapsable } from "@/components/nav-collapsable"
import { NavNonCollapsable } from "@/components/nav-non-collapsable"
import { NavUser } from "@/components/nav-user"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarRail,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import logoWhite from "../assets/logo-white.png"
import ResortAd from "@/assets/ads/resort.jpg"
import { useAuth } from "@/store/auth/useAuthStore"

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
    data: any
};

// This is sample data.

export function AppSidebar({ data, ...props }: AppSidebarProps) {

    const { user } = useAuth()

    return (
        <Sidebar className={"h-screen sticky top-0 left-0 w-56 xl:w-60 2xl:w-64"} collapsible="none"  {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size={null}
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-14 xl:size-16 data-[state=open]:size-16 items-center justify-center">
                                <img src={logoWhite} alt="" height={100} width={100} />
                            </div>
                            <div className="grid flex-1 text-left text-base xl:text-lg leading-tight gap-1">
                                <span className="truncate" title={user?.name}>{user?.name}</span>
                                <span className="truncate" title={user?.studentId}>{user?.studentId}</span>
                            </div>
                            {/* <ChevronsUpDown className="ml-auto" /> */}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="py-4! gap-0! flex! flex-col!" >
                <div className={"max-h-1/2 pb-4!"}>
                    {data?.navCollapsable && <NavCollapsable items={data.navCollapsable} />}
                    {data?.navNonCollapsable && <NavNonCollapsable projects={data.navNonCollapsable} />}
                </div>
                {
                    data?.showAd && (
                        <div className={"group-data-[collapsible=icon]:hidden p-1 flex! justify-center! items-center! flex-1! border-t-2"}>
                            <img src={ResortAd} alt={""} className={"w-full rounded-[8px]! border border-white/50 max-h-3/4!"} />
                        </div>
                    )
                }

            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
