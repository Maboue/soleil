import { AboutSection } from "./AboutSection";
import { ContactForm } from "./ContactForm";

export function AboutPage({ adminMode }: { adminMode: boolean }) {
  return (
    <div className="pt-8">
      <AboutSection adminMode={adminMode} />
      <ContactForm />
    </div>
  );
}

