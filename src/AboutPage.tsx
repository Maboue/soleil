import { AboutSection } from "./AboutSection";

export function AboutPage({ adminMode }: { adminMode: boolean }) {
  return (
    <div className="pt-8">
      <AboutSection adminMode={adminMode} />
    </div>
  );
}

