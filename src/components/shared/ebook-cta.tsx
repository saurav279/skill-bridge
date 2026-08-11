import Image from "next/image";
import Link from "next/link";
import { BookOpen, Check } from "lucide-react";
import { ebook } from "@/data/content-extra";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EbookCtaProps = {
  className?: string;
  compact?: boolean;
};

export function EbookCta({ className, compact }: EbookCtaProps) {
  return (
    <section
      id="ebook"
      className={cn(
        "scroll-mt-28 bg-background py-16 text-foreground md:py-20",
        className
      )}
    >
      <div className="container-page">
        <FadeIn>
          <div
            className={cn(
              "grid items-center gap-10 md:grid-cols-12",
              compact &&
                "rounded-3xl border border-border/80 bg-card p-6 shadow-soft sm:p-10"
            )}
          >
            <div className="md:col-span-7">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Free resource
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {ebook.title}
              </h2>
              <p className="mt-2 text-lg font-medium text-foreground">
                {ebook.subtitle}
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                {ebook.description}
              </p>
              <ul className="mt-6 space-y-2">
                {ebook.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
                render={
                  <Link
                    href={ebook.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                {ebook.ctaLabel}
              </Button>
            </div>

            <div className="md:col-span-5">
              <div className="relative mx-auto aspect-[3/4] max-w-[260px] overflow-hidden rounded-2xl border border-border/60 bg-muted/40 shadow-elevated">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="size-12 text-primary" aria-hidden />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-primary">
                    Skill Bridge
                  </p>
                  <p className="mt-2 text-lg font-bold leading-snug text-foreground">
                    Global Talent Visa E-Book
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Free download
                  </p>
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1456513080800-b6bbe4f5d3b0?w=600&h=800&fit=crop&q=80"
                  alt=""
                  fill
                  className="object-cover opacity-20"
                  sizes="260px"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
