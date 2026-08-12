import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/legal-document";
import { termsOfUse } from "@/data/legal";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing use of the ${company.name} website and consultancy services.`,
};

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title={termsOfUse.title}
      lastUpdated={termsOfUse.lastUpdated}
      intro={termsOfUse.intro}
      sections={termsOfUse.sections}
    />
  );
}
