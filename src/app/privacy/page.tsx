import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/legal-document";
import { privacyPolicy } from "@/data/legal";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${company.name} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title={privacyPolicy.title}
      lastUpdated={privacyPolicy.lastUpdated}
      intro={privacyPolicy.intro}
      sections={privacyPolicy.sections}
    />
  );
}
