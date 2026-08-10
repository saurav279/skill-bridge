import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 py-16 md:grid-cols-12 md:gap-10 md:py-24 lg:py-28">
        <div className="md:col-span-6 lg:col-span-6">
          <FadeIn>
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Global Talent Visa Consultancy
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Helping Exceptional Individuals Secure Global Talent Visas.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We guide founders, engineers, researchers, designers, product
              leaders, marketers, scientists and creators through the Global
              Talent Visa process with evidence-driven strategies.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-11 rounded-xl px-6"
                render={<Link href="/consultation" target="_blank" rel="noopener noreferrer"/>}
              >
                Book Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-xl px-6"
                render={<Link href="/case-studies" target="_blank" rel="noopener noreferrer"/>}
              >
                View Success Stories
              </Button>
            </div>
          </FadeIn>
        </div>

        <div className="md:col-span-6 lg:col-span-6">
          <FadeIn delay={0.12} direction="scale">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-elevated md:aspect-[5/4]">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=1200&fit=crop&q=80"
                alt="Modern professional workspace"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/20 via-transparent to-transparent" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
