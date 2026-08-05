import { company } from "@/data/company";

/**
 * Map embed for the contact page.
 * Override with NEXT_PUBLIC_MAP_EMBED_URL (Google Maps or OSM embed URL).
 */
const DEFAULT_MAP_EMBED_URL =
  process.env.NEXT_PUBLIC_MAP_EMBED_URL ??
  "https://www.openstreetmap.org/export/embed.html?bbox=-0.095%2C51.515%2C-0.070%2C51.528&layer=mapnik&marker=51.522%2C-0.082";

type ContactMapProps = {
  embedUrl?: string;
  className?: string;
  title?: string;
};

export function ContactMap({
  embedUrl = DEFAULT_MAP_EMBED_URL,
  className,
  title = `${company.name} office location`,
}: ContactMapProps) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
        <iframe
          title={title}
          src={embedUrl}
          className="h-[320px] w-full border-0 grayscale-[15%] contrast-[1.02] md:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{company.address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Open in maps
        </a>
      </div>
    </div>
  );
}
