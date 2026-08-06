import { conversionStats } from "@/data/conversion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";

export function ConversionStatsBand() {
  return (
    <section className="bg-primary py-14 text-primary-foreground md:py-16">
      <div className="container-page">
        <FadeIn>
          <StaggerChildren className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
            {conversionStats.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-primary-foreground/85">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </StaggerChildren>
          <p className="mt-8 text-center text-xs text-primary-foreground/70">
            *Industry-reported endorsement averages vary by year and pathway.
            Skill Bridge success rate reflects guided Stage 1 engagements.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
