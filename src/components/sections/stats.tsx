import { stats } from "@/data/stats";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";

export function StatsSection() {
  return (
    <section className="border-y border-border/70 bg-muted/20 py-14 md:py-16">
      <div className="container-page">
        <FadeIn>
          <StaggerChildren className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="text-center md:text-left">
                <p className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </FadeIn>
      </div>
    </section>
  );
}
