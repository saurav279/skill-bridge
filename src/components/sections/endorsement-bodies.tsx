import { endorsementBodyLogos } from "@/data/content-extra";
import { LogoShower } from "@/components/shared/logo-shower";

export function EndorsementBodiesSection() {
  return (
    <LogoShower
      eyebrow="Endorsement bodies"
      title="Who assesses Stage 1 endorsement"
      description="Applications are reviewed by specialist UK organisations across digital technology, science, engineering, research, and the arts. Skill Bridge prepares your case — the endorsing body makes the decision."
      items={endorsementBodyLogos}
      tone="muted"
    />
  );
}
