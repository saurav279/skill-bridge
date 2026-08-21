import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/shared/contact-form";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

type ContactSectionProps = {
  title?: string;
  description?: string;
  headingAs?: "h1" | "h2";
  className?: string;
  defaultValues?: {
    subject?: string;
    message?: string;
  };
  showStrategyLink?: boolean;
};

export function ContactSection({
  title = "We’re here to help",
  description = "Questions about fit, timelines, or working together? Send a message and we’ll respond within five business day.",
  headingAs = "h2",
  className,
  defaultValues,
  showStrategyLink = true,
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      className={cn("scroll-mt-28 py-16 md:py-24", className)}
    >
      <div className="container-page grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <FadeIn>
            <SectionTitle
              as={headingAs}
              eyebrow="Contact"
              title={title}
              description={description}
            />
            <ul className="mt-10 space-y-5">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>
                  <span className="block font-medium text-foreground">
                    Email
                  </span>
                  <a
                    href={`mailto:${company.email}`}
                    className="hover:text-foreground"
                  >
                    {company.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>
                  <span className="block font-medium text-foreground">
                    Phone
                  </span>
                  <a
                    href={`tel:${company.phone.replace(/\s+/g, "")}`}
                    className="hover:text-foreground"
                  >
                    {company.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Clock
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>
                  <span className="block font-medium text-foreground">
                    Response time
                  </span>
                  Within 5 business days
                </span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>
                  <span className="block font-medium text-foreground">
                    Office
                  </span>
                  {company.address}
                </span>
              </li>
            </ul>
            {showStrategyLink ? (
              <p className="mt-8 text-sm text-muted-foreground">
                Want to book a 1:1 strategy call?{" "}
                <Link
                  href="/packages/strategy-call"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Book a Strategy Call
                </Link>
                .
              </p>
            ) : null}
          </FadeIn>
        </div>

        <div className="md:col-span-7">
          <FadeIn delay={0.08}>
            <ContactForm defaultValues={defaultValues} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
