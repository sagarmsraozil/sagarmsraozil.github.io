import portfolioData from '@/data/portfolio.json'
import type { PortfolioData } from '@/types/portfolio'
import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ReferencesSection } from '@/components/sections/ReferencesSection'
import { CTASection } from '@/components/sections/CTASection'

const data = portfolioData as unknown as PortfolioData

export default function HomePage() {
  return (
    <>
      <Header name={data.navigation.name} links={data.navigation.links} />
      <main>
        <HeroSection data={data.hero} />
        <ProblemSection data={data.problem} />
        <ExperienceSection data={data.experience} />
        <AboutSection data={data.about} />
        <EducationSection data={data.education} />
        <SkillsSection data={data.skills} />
        <ReferencesSection data={data.references} />
        <CTASection data={data.cta} />
      </main>
    </>
  )
}
