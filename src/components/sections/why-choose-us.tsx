import {
  Compass,
  FileStack,
  Route,
  UsersRound,
} from "lucide-react";
import { whyChooseUs } from "@/data/stats";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";

const icons = {
  strategy: Compass,
  evidence: FileStack,
  guidance: Route,
  experts: UsersRound,
};

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            eyebrow="Why Skill Bridge"
            title="Built for exceptional talent — not volume applications."
            description="A premium consultancy model: strategy first, evidence by design, and dedicated experts who understand how endorsement panels evaluate excellence."
          />
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => {
            const Icon = icons[item.icon];
            return (
              <StaggerItem key={item.title}>
                <div className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated">
                  <div className="mb-5 inline-flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
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
