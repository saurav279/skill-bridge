import { cn } from "@/lib/utils";

type TimelineItem = {
  title: string;
  description?: string;
  meta?: string;
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
  numbered?: boolean;
};

export function Timeline({ items, className, numbered = true }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.title} className="relative flex gap-5 pb-10 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm font-semibold text-primary shadow-soft">
                {numbered ? (
                  index + 1
                ) : (
                  <span className="text-[10px] font-mono tracking-tight">
                    {item.meta?.slice(2) ?? "•"}
                  </span>
                )}
              </div>
              {!isLast ? (
                <div
                  className="mt-2 w-px flex-1 bg-primary/25"
                  aria-hidden
                />
              ) : null}
            </div>
            <div className="pb-2 pt-1.5">
              {item.meta ? (
                <p className="mb-1 font-mono text-xs uppercase tracking-wider text-primary">
                  {item.meta}
                </p>
              ) : null}
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                {item.title}
              </h3>
              {item.description ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
