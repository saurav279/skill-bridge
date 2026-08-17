"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BrandLogo } from "@/components/shared/brand-logo";
import { packages } from "@/data/packages";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";
import { socialIcons } from "@/components/shared/social-icons";

const aboutLinks = [
  { href: "/about", label: "About Skill Bridge" },
  { href: "/about/gtv", label: "UK Global Talent Visa" },
];

const resourceLinks = [
  { href: "/resources", label: "Insights & Guides" },
  { href: "/assessment", label: "Assessment Questionnaire" },
];

type MobileSection = "about" | "packages" | "resources" | null;

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSection>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
    setPackagesOpen(false);
    setResourcesOpen(false);
    setMobileSection(null);
  }, [pathname]);

  const hideChrome = pathname === "/login" || pathname === "/register";

  const skipPackageSlugs = ["strategy-call", "appeal-diagnosis", "appeal-rebuild", "appeal-full-support"];
  const filteredPackages = packages.filter((pkg) => !skipPackageSlugs.includes(pkg.slug));
  if (hideChrome) return null;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar — Michelle Hua style */}
      <div className="hidden border-b border-primary/20 bg-primary text-primary-foreground sm:block">
        <div className="container-page flex h-12 items-center justify-between text-xs font-medium">
          <Link href="/about/gtv" className="hover:underline">
            About the UK Global Talent Visa
          </Link>
          <div className="flex flex-wrap gap-2 my-2">
              {socialIcons.map(({ key, label, path }) => (
                <a
                  key={key}
                  href={company.socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-border/60 bg-background/90 shadow-soft backdrop-blur-xl"
            : "border-border/40 bg-background"
        )}
      >
        <nav
          className="container-page flex h-[4.25rem] items-center justify-between gap-3"
          aria-label="Primary"
        >
          <BrandLogo height={30} priority />

          <div className="hidden items-center gap-0.5 lg:flex">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>

            <Dropdown
              label="About"
              open={aboutOpen}
              setOpen={setAboutOpen}
              active={pathname.startsWith("/about")}
            >
              {aboutLinks.map((l) => (
                <DropdownItem key={l.href} href={l.href}>
                  {l.label}
                </DropdownItem>
              ))}
            </Dropdown>

            <Dropdown
              label="Packages"
              open={packagesOpen}
              setOpen={setPackagesOpen}
              active={pathname.startsWith("/packages")}
            >
              {filteredPackages.map((p) => (
                <DropdownItem key={p.slug} href={`/packages/${p.slug}`}>
                  {p.name}
                </DropdownItem>
              ))}
              <DropdownItem href="/packages">Compare all packages</DropdownItem>
            </Dropdown>

            <NavLink
              href="/case-studies"
              active={pathname.startsWith("/case-studies")}
            >
              Success Stories
            </NavLink>
            <NavLink href="/appeal" active={pathname === "/appeal"}>
              Appeal
            </NavLink>
            <Dropdown
              label="Resources"
              open={resourcesOpen}
              setOpen={setResourcesOpen}
              active={pathname.startsWith("/resources")}
            >
              <DropdownItem href="/resources">Insights & Guides</DropdownItem>
              {/* <DropdownItem href="/resources#newsletters">Newsletters</DropdownItem> */}
              <DropdownItem href="/assessment">Assessment Questionnaire</DropdownItem>
            </Dropdown>
            <NavLink href="/contact" active={pathname === "/contact"}>
              Contact
            </NavLink>
          </div>

          <div className="flex items-center gap-1.5">
            {/* <ThemeToggle /> */}
            <Button
              size="sm"
              className="hidden h-10 rounded-full px-4 text-xs font-semibold uppercase tracking-wide sm:inline-flex"
              render={<Link href="/assessment" target="_blank" rel="noopener noreferrer"/>}
            >
              Assessment Questionnaire
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => {
                setOpen((v) => !v);
                setMobileSection(null);
              }}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="mobile-nav"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: easeOut }}
              className="overflow-hidden border-t border-border/60 bg-background lg:hidden"
            >
              <div className="container-page flex max-h-[min(34rem,calc(100dvh-5.5rem))] flex-col gap-0.5 overflow-y-auto py-4">
                <MobileLink href="/" active={pathname === "/"}>
                  Home
                </MobileLink>

                <MobileNavGroup
                  id="about"
                  label="About"
                  open={mobileSection === "about"}
                  onToggle={() =>
                    setMobileSection((s) => (s === "about" ? null : "about"))
                  }
                  active={pathname.startsWith("/about")}
                >
                  {aboutLinks.map((l) => (
                    <MobileLink key={l.href} href={l.href} nested>
                      {l.label}
                    </MobileLink>
                  ))}
                </MobileNavGroup>

                <MobileNavGroup
                  id="packages"
                  label="Packages"
                  open={mobileSection === "packages"}
                  onToggle={() =>
                    setMobileSection((s) =>
                      s === "packages" ? null : "packages"
                    )
                  }
                  active={pathname.startsWith("/packages")}
                >
                  {filteredPackages.map((p) => (
                    <MobileLink
                      key={p.slug}
                      href={`/packages/${p.slug}`}
                      nested
                    >
                      {p.name}
                    </MobileLink>
                  ))}
                  <MobileLink href="/packages" nested>
                    Compare all packages
                  </MobileLink>
                </MobileNavGroup>

                <MobileNavGroup
                  id="resources"
                  label="Resources"
                  open={mobileSection === "resources"}
                  onToggle={() =>
                    setMobileSection((s) =>
                      s === "resources" ? null : "resources"
                    )
                  }
                  active={pathname.startsWith("/resources")}
                >
                  {resourceLinks.map((l) => (
                    <MobileLink key={l.href} href={l.href} nested>
                      {l.label}
                    </MobileLink>
                  ))}
                </MobileNavGroup>

                <MobileLink
                  href="/case-studies"
                  active={pathname.startsWith("/case-studies")}
                >
                  Success Stories
                </MobileLink>
                <MobileLink href="/appeal" active={pathname === "/appeal"}>
                  Appeal
                </MobileLink>
                <MobileLink href="/contact" active={pathname === "/contact"}>
                  Contact
                </MobileLink>
                <Button
                  className="mt-3 h-11 rounded-full font-semibold uppercase tracking-wide"
                  render={
                    <Link
                      href="/assessment"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  Assessment Questionnaire
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground/80 hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

function Dropdown({
  label,
  open,
  setOpen,
  active,
  children,
}: {
  label: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active || open
            ? "bg-primary/10 text-primary"
            : "text-foreground/80 hover:bg-muted hover:text-foreground"
        )}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown className="size-3.5 opacity-70" />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 min-w-[220px] pt-1">
          <div className="rounded-xl border border-border bg-card p-1.5 shadow-elevated">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DropdownItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {children}
    </Link>
  );
}

function MobileNavGroup({
  id,
  label,
  open,
  onToggle,
  active,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const panelId = `mobile-nav-${id}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          open || active
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-muted"
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-70 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open && "rotate-180"
          )}
        />
      </button>
      <motion.div
        id={panelId}
        role="region"
        inert={!open || undefined}
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{
          duration: reduce ? 0 : 0.3,
          ease: easeOut,
        }}
        className="overflow-hidden"
      >
        <motion.div
          initial={false}
          animate={open ? "open" : "closed"}
          variants={{
            open: {
              transition: { staggerChildren: 0.045, delayChildren: 0.05 },
            },
            closed: {
              transition: { staggerChildren: 0.02, staggerDirection: -1 },
            },
          }}
          className="mb-1 ml-3 mt-1 flex flex-col gap-0.5 border-l border-primary/20 pl-2"
        >
          {Children.map(children, (child) => (
            <motion.div
              variants={{
                open: { opacity: 1, x: 0 },
                closed: { opacity: 0, x: -10 },
              }}
              transition={{ duration: reduce ? 0 : 0.22, ease: easeOut }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function MobileLink({
  href,
  children,
  nested,
  active,
}: {
  href: string;
  children: React.ReactNode;
  nested?: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        nested
          ? "text-foreground/80 hover:bg-primary/10 hover:text-primary"
          : "text-foreground hover:bg-muted",
        active && "bg-primary/10 text-primary"
      )}
    >
      {children}
    </Link>
  );
}
