import type { EducationData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './EducationSection.module.scss'

interface EducationSectionProps {
  data: EducationData
}

export function EducationSection({ data }: Readonly<EducationSectionProps>) {
  return (
    <section className={styles.education} aria-label="Education">
      <div className={styles.educationInner}>
        <SectionLabel text={data.label} as="h2" />
        <div className={styles.educationList}>
          {data.entries.map((entry) => (
            <div key={entry.institution} className={styles.educationItem}>
              <div className={styles.educationItemMain}>
                <a
                  href={entry.url}
                  className={styles.educationInstitution}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {entry.institution}
                </a>
                <p className={styles.educationDegree}>{entry.degree}</p>
              </div>
              <div className={styles.educationItemMeta}>
                <time className={styles.educationPeriod}>{entry.period}</time>
                <span className={styles.educationLocation}>{entry.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
