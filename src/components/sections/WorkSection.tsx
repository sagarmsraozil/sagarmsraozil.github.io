import type { WorkData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { CaseStudyCard } from './CaseStudyCard'
import { AdditionalProjectCard } from './AdditionalProjectCard'
import styles from './WorkSection.module.scss'

interface WorkSectionProps {
  data: WorkData
}

export function WorkSection({ data }: Readonly<WorkSectionProps>) {
  return (
    <section id="work" className={styles.work} aria-label="Work">
      <div className={styles.workInner}>
        <SectionLabel text={data.label} />
        <h2 className={styles.workHeading}>{data.heading}</h2>
        <p className={styles.workIntro}>{data.intro}</p>

        <div className={styles.workStudies}>
          {data.caseStudies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>

        {data.additionalProjects.length > 0 && (
          <div className={styles.workEarlier}>
            <SectionLabel text={data.additionalLabel} className={styles.workEarlierLabel} />
            <div className={styles.workEarlierProjects}>
              {data.additionalProjects.map((project) => (
                <AdditionalProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
