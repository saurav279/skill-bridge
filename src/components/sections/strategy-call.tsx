
import { FadeIn } from "@/components/shared/fade-in";
import { company } from "@/data/company";

import { SectionTitle } from "../shared/section-title";
import { ContactMap } from "../shared/contact-map";
import { ContactForm } from "../shared/contact-form";

export function FreeStrategyCallCta({customerDetails, assessmentId}: {customerDetails: {name: string, email: string, phone: string, livesInUk: boolean, currentVisa?: string}, assessmentId: string}) {
  const subject = `Requesting Free Discovery Call — ${customerDetails.name}`;

  const message = `Hi Skill Bridge,
  
  I’ve completed my assessment and would like to request for my free strategy call.
  
  I’d like to understand my results, explore the most suitable UK pathway for my profile, and learn what I should do next.
  
  I'm ok with phone call.
  
  Thank you!`;

  return (
    <section className="border-t border-border/70 bg-muted/20 pb-20 pt-12 md:pb-28 md:pt-16">
      <div className="container-page">

        <FadeIn delay={0.08}>
        <SectionTitle
              eyebrow="Next Step: Free Discovery Call"
              title="Request a Free Discovery Call"
              description="Let's discuss your UK options and explore the most suitable pathway for your profile."
              className="mb-8"
            />
          <ContactForm defaultValues={{
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone,
            livesInUk: customerDetails.livesInUk,
            currentVisa: customerDetails.currentVisa ?? "",
            message: message,
            subject: subject,
          }} />

        </FadeIn>

      </div>
    </section>
  );
}
