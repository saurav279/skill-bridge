"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { company } from "@/data/company";
import { socialIcons } from "@/components/shared/social-icons";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/appeal", label: "Appeal" },
  { href: "/case-studies", label: "Case Studies" },
  // { href: "/login", label: "Client Login" },
];

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our Story" },
  { href: "/packages", label: "Packages" },
  { href: "/resources", label: "Resources" },
  { href: "/case-studies", label: "Success Stories" },
];

const resourceLinks = [
  { href: "/assessment", label: "Assessment Questionnaire" },
  { href: "/resources", label: "Insights & Guides" },
  // { href: "/resources#newsletters", label: "Newsletters" },
  { href: "/packages/strategy-call", label: "Book Strategy Call" },
  { href: "/contact", label: "Contact Us" },
];



export function Footer() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <BrandLogo height={28} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {company.disclaimer}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary dark:text-white"
                  aria-hidden
                />
                <span>{company.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-primary dark:text-white"
                  aria-hidden
                />
                <a
                  href={`tel:${company.phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground"
                >
                  {company.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-primary dark:text-white"
                  aria-hidden
                />
                <a
                  href={`mailto:${company.email}`}
                  className="hover:text-foreground"
                >
                  {company.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
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

          <FooterCol
            title="Company"
            links={companyLinks}
            className="md:col-span-2 md:col-start-6"
          />
          <FooterCol
            title="Navigation"
            links={navigation}
            className="md:col-span-2"
          />
          <FooterCol
            title="Resources"
            links={resourceLinks}
            className="md:col-span-2"
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  className,
}: {
  title: string;
  links: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary dark:text-white">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
