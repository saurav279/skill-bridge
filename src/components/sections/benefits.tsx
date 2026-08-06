import {
  Briefcase,
  Building2,
  Flag,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { benefits } from "@/data/conversion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";

const icons = [
  Flag,
  ShieldCheck,
  Briefcase,
  HeartHandshake,
  Rocket,
  Building2,
  RefreshCw,
];

export function BenefitsSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            eyebrow="Benefits"
            title="Benefits of the UK Global Talent Visa"
            description="Why exceptional founders, engineers, researchers, and creators choose this route."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {benefits.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={item.title}>
                <div className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold leading-snug tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
