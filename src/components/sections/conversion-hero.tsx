import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

export function ConversionHero() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&h=1200&fit=crop&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
      </div>

      <div className="container-page relative grid min-h-[78vh] items-center gap-10 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-8 lg:col-span-7">
          <FadeIn>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-white">
              UK Global Talent Visa Consultancy
            </p>
            <h1 className="text-white/90 text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Helping Exceptional Talent Secure the UK Global Talent Visa
            </h1>
            <p className="mt-4 text-xl font-medium text-white/90 sm:text-2xl">
              Want to Build Your Tech Career in the UK?
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Discover what is required to obtain the highly sought-after UK
              Global Talent Visa in Digital Technology — and complete our
              Assessment Questionnaire for a free 15-minute discovery call.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-full px-7 text-sm font-semibold uppercase tracking-wide"
                render={<Link href="/assessment" target="_blank" rel="noopener noreferrer"/>}
              >
                Start Assessment Questionnaire
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/30 bg-transparent px-7 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/packages" target="_blank" rel="noopener noreferrer"/>}
              >
                View Packages
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
