import type { Metadata } from "next";
import {
  CaseStudiesGrid,
  CaseStudiesHeader,
} from "@/components/sections/case-studies-grid";
import { EbookCta } from "@/components/shared/ebook-cta";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { ConversionPackages } from "@/components/sections/conversion-packages";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Browse Skill Bridge Global Talent Visa success stories — challenge, strategy, and outcome for exceptional professionals.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudiesHeader />
      <CaseStudiesGrid />

      <ConversionPackages />
      <EbookCta />
      <ReadyToStartCta />
    </>
  );
}
