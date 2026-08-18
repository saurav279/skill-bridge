import Image from "next/image";
import { cn } from "@/lib/utils";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";

export type LogoItem = {
  name: string;
  src: string;
  href?: string;
};

type LogoShowerProps = {
  eyebrow: string;
  title: string;
  description?: string;
  items: LogoItem[];
  /** Visual band behind the grid. */
  tone?: "default" | "muted";
  className?: string;
};

export function LogoShower({
  eyebrow,
  title,
  description,
  items,
  tone = "default",
  className,
}: LogoShowerProps) {
  const columns =
    items.length <= 4
      ? "grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <section
      className={cn(
        "py-20 md:py-28",
        tone === "muted" && "border-y border-border/70 bg-muted/20",
        className
      )}
    >
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            description={description}
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <StaggerChildren className={cn("mt-12 grid gap-4", columns)}>
          {items.map((item) => {
            const inner = (
              <>
                <div className="flex h-20 w-full items-center justify-center">
                  <Image
                    src={item.src}
                    alt={`${item.name} logo`}
                    width={200}
                    height={80}
                    className="max-h-16 w-auto max-w-[168px] object-contain"
                  />
                </div>
                <p className="mt-4 text-center text-xs font-medium leading-snug text-muted-foreground">
                  {item.name}
                </p>
              </>
            );

            const cardClass =
              "flex h-full flex-col items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-soft";

            return (
              <StaggerItem key={item.name}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      cardClass,
                      "transition-colors hover:border-primary/30"
                    )}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cardClass}>{inner}</div>
                )}
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
