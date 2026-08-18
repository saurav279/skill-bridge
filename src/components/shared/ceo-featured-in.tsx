import { company } from "@/data/company";
import { LogoShower } from "@/components/shared/logo-shower";

export function CeoFeaturedIn() {
  return (
    <LogoShower
      eyebrow="Featured in"
      title="Our CEO is featured in the following publications"
      description="Recognition and press covering Skill Bridge’s founder and the work behind our consultancy."
      items={company.ceoFeaturedIn}
    />
  );
}
