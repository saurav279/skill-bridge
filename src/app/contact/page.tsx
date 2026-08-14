import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/shared/contact-form";
import { ContactMap } from "@/components/shared/contact-map";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { company } from "@/data/company";
import { ConversionPackages } from "@/components/sections/conversion-packages";
import { EbookCta } from "@/components/shared/ebook-cta";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${company.name} about Global Talent Visa strategy, partnerships, or general inquiries.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <FadeIn>
              <SectionTitle
                as="h1"
                eyebrow="Contact"
                title="We’re here to help"
                description="Questions about fit, timelines, or working together? Send a message and we’ll respond within five business day."
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
                    Within 1 business day
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
            </FadeIn>
          </div>

          <div className="md:col-span-7">
            <FadeIn delay={0.08}>
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-muted/20 pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Location"
              title="Visit us"
              description={`Find ${company.name} at ${company.address}.`}
              className="mb-8"
            />
            <ContactMap />
          </FadeIn>
        </div>
      </section>

      <ConversionPackages />
      <EbookCta />
      <ReadyToStartCta />
    </>
  );
}
