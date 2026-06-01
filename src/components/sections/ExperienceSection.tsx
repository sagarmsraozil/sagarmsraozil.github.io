import type { ExperienceData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ExperienceCard } from './ExperienceCard'
import styles from './ExperienceSection.module.scss'

interface ExperienceSectionProps {
  data: ExperienceData
}

export function ExperienceSection({ data }: Readonly<ExperienceSectionProps>) {
  return (
    <section id="experience" className={styles.experience} aria-label="Experience">
      <div className={styles.experienceInner}>
        <SectionLabel text={data.label} />
        <h2 className={styles.experienceHeading}>{data.heading}</h2>

        <div className={styles.experienceEntries}>
          {data.entries.map((entry) => (
            <ExperienceCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
