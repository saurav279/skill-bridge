import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/shared/contact-form";
import { ContactMap } from "@/components/shared/contact-map";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Skill Bridge about Global Talent Visa strategy, partnerships, or general inquiries.",
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
                description="Questions about fit, timelines, or working together? Send a message and we’ll respond within one business day."
              />
              <ul className="mt-10 space-y-5">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <Mail
                    className="mt-0.5 size-4 shrink-0 text-foreground"
                    aria-hidden
                  />
                  <span>
                    <span className="block font-medium text-foreground">
                      Email
                    </span>
                    hello@skillbridge.example
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <Clock
                    className="mt-0.5 size-4 shrink-0 text-foreground"
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
                    className="mt-0.5 size-4 shrink-0 text-foreground"
                    aria-hidden
                  />
                  <span>
                    <span className="block font-medium text-foreground">
                      Office
                    </span>
                    Shoreditch, London · Remote meetings available
                  </span>
                </li>
              </ul>
              <p className="mt-8 text-sm text-muted-foreground">
                Ready to book time?{" "}
                <Link
                  href="/consultation"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Open the calendar
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
              title="Visit us in London"
              description="Based in Shoreditch — happy to meet on-site or remotely."
              className="mb-8"
            />
            <ContactMap />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
