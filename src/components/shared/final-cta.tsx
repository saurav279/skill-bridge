import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

type FinalCTAProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function FinalCTA({
  title = "Ready to Begin Your Global Talent Journey?",
  description = "Book a free consultation. We’ll assess your profile and outline a clear, evidence-driven path forward.",
  className,
}: FinalCTAProps) {
  return (
    <section className={cn("py-20 md:py-28", className)}>
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft sm:px-12 md:py-20">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.454_0.310_265.4_/_0.14),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_oklch(0.58_0.28_265.4_/_0.2),_transparent_55%)]"
              aria-hidden
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-11 rounded-xl px-6 text-sm"
                  render={<Link href="/consultation" />}
                >
                  Book Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-xl px-6 text-sm"
                  render={<Link href="/contact" />}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
