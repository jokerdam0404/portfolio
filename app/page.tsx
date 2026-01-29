// Space to Wall Street Hero - Cinematic Journey
import { CinematicVideoHero } from "@/components/hero";
import MetricsGrid from "@/components/sections/MetricsGrid";
import CaseStudySection from "@/components/sections/CaseStudySection";
import About from "@/components/sections/About";
import FinanceJourney from "@/components/sections/FinanceJourney";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import PageTransition from "@/components/animations/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#050505]">
        <CinematicVideoHero />
        <MetricsGrid />
        <CaseStudySection />
        <About />
        <FinanceJourney />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
    </PageTransition>
  );
}

