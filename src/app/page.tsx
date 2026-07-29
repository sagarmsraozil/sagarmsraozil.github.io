import portfolioData from '@/data/portfolio.json'
import type { PortfolioData } from '@/types/portfolio'
import { Header } from '@/components/layout/Header'
import { IntroSection } from '@/components/sections/IntroSection'
import { SummarySection } from '@/components/sections/SummarySection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { AiEngineeringSection } from '@/components/sections/AiEngineeringSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { ReferencesSection } from '@/components/sections/ReferencesSection'
import { CTASection } from '@/components/sections/CTASection'

const data = portfolioData as unknown as PortfolioData

export default function HomePage() {
  return (
    <>
      <Header name={data.navigation.name} links={data.navigation.links} />
      <main>
        <IntroSection data={data.header} />
        <SummarySection data={data.summary} />
        <SkillsSection data={data.skills} />
        <ExperienceSection data={data.experience} />
        <ProjectsSection data={data.projects} />
        <AiEngineeringSection data={data.aiEngineering} />
        <EducationSection data={data.education} />
        <ReferencesSection data={data.references} />
        <CTASection data={data.cta} />
      </main>
    </>
  )
}
