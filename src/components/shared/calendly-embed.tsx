"use client";

const DEFAULT_CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  "https://calendly.com/acme-corp/30min";

type CalendlyEmbedProps = {
  url?: string;
  className?: string;
};

/**
 * Inline Calendly calendar embed.
 * Set NEXT_PUBLIC_CALENDLY_URL to your real Calendly event link
 * (e.g. https://calendly.com/your-team/consultation).
 */
export function CalendlyEmbed({
  url = DEFAULT_CALENDLY_URL,
  className,
}: CalendlyEmbedProps) {
  const src = `${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1&hide_event_type_details=0`;

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
        <iframe
          title="Book a consultation on Calendly"
          src={src}
          className="h-[700px] w-full border-0 md:h-[750px]"
          loading="lazy"
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Powered by Calendly · Configure your link via{" "}
        <code className="font-mono text-[11px]">NEXT_PUBLIC_CALENDLY_URL</code>
      </p>
    </div>
  );
}
