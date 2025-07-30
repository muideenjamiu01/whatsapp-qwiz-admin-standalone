import { Home, ListChecks,School,Users } from "lucide-react";
// import { usePathname } from "next/navigation"
// import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { Link, useLocation } from "react-router";
// import { ModeToggle } from "./mode-toggle"

export function AppSidebar() {
  const pathname = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Quizzes",
      icon: ListChecks,
      href: "/quizzes",
    },
    {
      title: "Course Management",
      icon: School,
      href: "/courses",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/users",
    },
    // {
    //   title: "Create Quiz",
    //   icon: Plus,
    //   href: "/quizzes/create",
    // },
    // {
    //   title: "Analytics",
    //   icon: BarChart3,
    //   href: "/analytics",
    // },
    // {
    //   title: "Settings",
    //   icon: Settings,
    //   href: "/settings",
    // },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Whatsapp Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@qwizfun.com</p>
            </div>
          </div>
          {/* <ModeToggle /> */}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
