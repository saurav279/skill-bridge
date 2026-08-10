"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { company } from "@/data/company";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/appeal", label: "Appeal" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/login", label: "Client Login" },
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
  { href: "/consultation", label: "Book Consultation" },
  { href: "/contact", label: "Contact Us" },
];

const socialIcons: {
  key: keyof typeof company.socialLinks;
  label: string;
  path: string;
}[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  },
  {
    key: "twitter",
    label: "X",
    path: "M4 4l16 16M20 4L4 20",
  },
  {
    key: "youtube",
    label: "YouTube",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.98l5.75 3.02-5.75 3.02z",
  },
  {
    key: "instagram",
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z",
  },
  {
    key: "facebook",
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <BrandLogo height={28} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Evidence-driven Global Talent Visa consultancy for exceptional
              founders, engineers, researchers, designers, and creators.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>{company.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-primary"
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
                  className="mt-0.5 size-4 shrink-0 text-primary"
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
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
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
      <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
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
