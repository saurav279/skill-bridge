import { cn } from "@/lib/utils";
import { BadgeText } from "./badge";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
       <BadgeText text={eyebrow} />
      ) : null}
      <Tag
        className={cn(
          "text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
