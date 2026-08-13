import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  consultationPackageIds,
  getConsultationPackage,
} from "@/data/consultation-packages";
import { BookingWizard } from "@/components/consultation/booking-wizard";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";

type PageProps = {
  params: Promise<{ package_name: string }>;
};

export function generateStaticParams() {
  return consultationPackageIds.map((package_name) => ({ package_name }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { package_name } = await params;
  const pkg = getConsultationPackage(package_name);
  if (!pkg) return { title: "Book consultation" };
  return {
    title: `Book ${pkg.name}`,
    description: pkg.description,
  };
}

export default async function BookingPackagePage({ params }: PageProps) {
  const { package_name } = await params;
  const pkg = getConsultationPackage(package_name);
  if (!pkg) notFound();

  const isFree = pkg.id === "free-strategy-call";

  return (
    <section className="py-16 md:py-24">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow={pkg.tagline}
              title={`Book ${pkg.name}`}
              description={pkg.description}
            />
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">01</span>
                Share your name, email, and a short note
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">02</span>
                Pick a UK time slot ({pkg.slotDurationMinutes} minutes)
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">03</span>
                {isFree ? "Your calendar invite follows" : "Pay with Stripe — your calendar invite follows"}
              </li>
            </ul>
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer a different package?{" "}
              <Link
                href="/consultations"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                View all packages
              </Link>
              .
            </p>
          </FadeIn>
        </div>
        <div className="md:col-span-7">
          <FadeIn delay={0.08}>
            <BookingWizard pkg={pkg} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
