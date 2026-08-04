import { testimonials } from "@/data/testimonials";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";

export function TestimonialsSection() {
  return (
    <section className="bg-muted/20 py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            eyebrow="Testimonials"
            title="Trusted by operators who ship."
            description="Leaders choose Skill Bridge for clarity, rigor, and a process that respects their time."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <TestimonialCard testimonial={t} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
