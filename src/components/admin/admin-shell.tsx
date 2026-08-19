"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ClipboardList,
  CreditCard,
  Inbox,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/admin/contacts", label: "Contact inbox", icon: Inbox },
  { href: "/admin/purchases", label: "Purchases", icon: CreditCard },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const current = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <Link
            href="/admin/leads"
            className="inline-flex items-center"
            aria-label="Admin dashboard"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="Skill Bridge"
              width={148}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full justify-start rounded-xl text-muted-foreground"
            onClick={() => router.replace("/admin/login")}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                Admin
              </p>
              <h1 className="text-sm font-semibold tracking-tight sm:text-base">
                {current?.label ?? "Dashboard"}
              </h1>
            </div>
          </div>
          {/* <ThemeToggle /> */}
        </header>
        <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
