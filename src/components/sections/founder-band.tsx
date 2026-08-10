import Image from "next/image";
import Link from "next/link";
import { team } from "@/data/team";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

export function FounderBand() {
  const founder = team.find((m) => m.founder) ?? team[0];

  return (
    <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
      <div className="container-page grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <FadeIn direction="scale">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl shadow-elevated">
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </FadeIn>
        </div>
        <div className="md:col-span-7">
          <FadeIn delay={0.08}>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Meet the team
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Hi! We&apos;re Skill Bridge
            </h2>
            <p className="mt-2 text-lg font-medium text-foreground/90">
              {founder.name} · {founder.role}
            </p>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Skill Bridge is a UK Global Talent Visa consultancy. We help
                highly skilled founders, engineers, researchers, designers, and
                creators with Stage 1 endorsement for the UK Global Talent Visa
                in Digital Technology — with evidence-driven strategy, not
                volume processing.
              </p>
              <p>
                Our approach mirrors what endorsement panels actually evaluate:
                clear criteria mapping, structured applications, and rigorous
                review. Clients choose us for clarity, pace, and a{" "}
                <strong className="font-semibold text-foreground">
                  95% guided success rate
                </strong>{" "}
                against industry averages that are often far lower.
              </p>
              <p>
                We only coach Stage 1 endorsement preparation. For immigration
                advice on the visa application itself, we recommend instructing
                a qualified immigration solicitor.
              </p>
            </div>
            <Button
              className="mt-8 h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
              render={<Link href="/about" target="_blank" rel="noopener noreferrer"/>}
            >
              Learn More About Us
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
