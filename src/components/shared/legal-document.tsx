import { FadeIn } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import type { LegalSection } from "@/data/legal";

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalDocument({
  eyebrow,
  title,
  lastUpdated,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <article className="py-16 md:py-24">
      <div className="container-page max-w-3xl">
        <FadeIn>
          <SectionTitle as="h1" eyebrow={eyebrow} title={title} />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Last updated · {lastUpdated}
          </p>
          <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {intro}
          </p>
        </FadeIn>

        <div className="mt-14 space-y-12">
          {sections.map((section, index) => (
            <FadeIn key={section.id} delay={Math.min(index * 0.03, 0.2)}>
              <section id={section.id} className="scroll-mt-28">
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={`${section.id}-p-${i}`}>{paragraph}</p>
                  ))}
                  {section.bullets?.length ? (
                    <ul className="list-disc space-y-2 pl-5 text-foreground/85">
                      {section.bullets.map((item, i) => (
                        <li key={`${section.id}-b-${i}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            </FadeIn>
          ))}
        </div>
      </div>
    </article>
  );
}
