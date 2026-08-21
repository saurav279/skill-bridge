"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/shared/contact-form";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";


const defaultValues = {
  subject: "Inquiry about Global Talent Endorsement",
  message: `Hi,

I’m interested in discussing my possibilities for Global Talent Endorsement.

My background:
- Role: [Your role]
- Field: [Your field]
- Experience: [X years]
- Current location: [Country]


[Any other information you want to share]

I’d like to discuss my profile, potential fit, the expected timeline, and the next steps.

My questions:
[Your questions]

My preferred time to connect:
[Day(s) and time(s) that work for you, including your time zone]

Best,
[Your name]`,
}
export default function PaidLeadsSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  //scroll to top
  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo(0, 0);
    }
  }, [isSubmitted]);
  return (
    <section
      id="contact"
      className={cn("scroll-mt-28 py-8 md:py-16 md:py-24")}
    >
      <div className="container-page grid gap-12 md:grid-cols-12 md:gap-10">
     {!isSubmitted &&   <div className="order-2 md:order-1 md:col-span-5">

          <FadeIn>
            <SectionTitle
            className="hidden md:block"
              as="h1"
              eyebrow="Contact"
              title="We’re here to help"
              description="We’re here to help
Fill up the form to discuss about fit, timelines, or working together? Send a message and check your chances for Global Talent Endorsement. "
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
         
              <p className="mt-8 text-sm text-muted-foreground">
                Want a free assessment?{" "}
                <Link
                  href="/assessment"
                  target="_blank"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Do a Free Assessment
                </Link>
                .
              </p>
     
          </FadeIn>
        </div>}

        <div
          className={cn(
            isSubmitted
              ? "md:col-span-8 md:col-start-3"
              : "order-1 md:order-2 md:col-span-7"
          )}
        >
          <FadeIn delay={0.08}>
          <SectionTitle
            className="md:hidden block mb-4"
              as="h1"
              eyebrow="Contact"
              title="We’re here to help"
              description="We’re here to help
Fill up the form to discuss about fit, timelines, or working together? Send a message and check your chances for Global Talent Endorsement. "
            />
            <ContactForm defaultValues={defaultValues} onSubmitCallback={() => setIsSubmitted(true)} />
          </FadeIn>
        </div>
      </div>

 { !isSubmitted &&    <ReadyToStartCta />}
      
    </section>
  );
}
