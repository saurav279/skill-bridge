import { FadeIn } from "@/components/shared/fade-in";
import { TestimonialsCarousel } from "@/components/shared/testimonials-carousel";

export function TestimonialsSection() {
  return (
    <section className="bg-muted/20 py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <TestimonialsCarousel />
        </FadeIn>
      </div>
    </section>
  );
}
