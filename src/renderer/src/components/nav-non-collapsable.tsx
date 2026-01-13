"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import { Link } from "react-router"

export function NavNonCollapsable({
  projects,
  title
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[],
  title ?: string
}) {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:visible xl:py-4!">
      {title && <SidebarGroupLabel>Projects</SidebarGroupLabel>}
      <SidebarMenu className="space-y-1! xl:space-y-2!">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton className="text-xl 2xl:text-[1.3rem]" tooltip={item.name} asChild>
              <Link to={item.url} className={"py-2! 2xl:py-6!"}>
                <item.icon className="size-6!" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
