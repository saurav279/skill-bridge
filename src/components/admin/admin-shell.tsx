"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import {
  CalendarClock,
  ClipboardList,
  CreditCard,
  Inbox,
  LogOut,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type NavSection = {
  label: string;
  items: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
};

const navSections: NavSection[] = [
  {
    label: "Leads",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Users },
      { href: "/admin/users", label: "Users", icon: UserRound },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/admin/assessments", label: "Assessments", icon: ClipboardList },
      { href: "/admin/contacts", label: "Contact Inbox", icon: Inbox },
      { href: "/admin/purchases", label: "Package Purchases", icon: CreditCard },
    ],
  },
  {
    label: "Payments",
    items: [
      { href: "/admin/payment-plans", label: "Payment Plans", icon: Wallet },
      { href: "/admin/installments", label: "Installments", icon: CalendarClock },
    ],
  },
];

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/admin/leads" />}
              tooltip="Skill Bridge Admin"
              className="cursor-pointer"
            >
              <Image
                src="/fav/apple-touch-icon.png"
                alt=""
                width={32}
                height={32}
                className="hidden size-8 rounded-md group-data-[collapsible=icon]:block"
              />
              <Image
                src="/logo.png"
                alt="Skill Bridge"
                width={148}
                height={28}
                className="h-7 w-auto group-data-[collapsible=icon]:hidden"
                priority
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={active}
                      tooltip={label}
                      className="cursor-pointer"
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function SignOutButton() {
  const router = useRouter();

  return (
    <SidebarMenuButton
      tooltip="Sign out"
      className="cursor-pointer"
      onClick={() => router.replace("/admin/login")}
    >
      <LogOut />
      <span>Sign out</span>
    </SidebarMenuButton>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Find current page label for header
  let currentLabel = "Dashboard";
  for (const section of navSections) {
    const item = section.items.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (item) {
      currentLabel = item.label;
      break;
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Admin
            </p>
            <h1 className="text-sm font-semibold tracking-tight sm:text-base">
              {currentLabel}
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}