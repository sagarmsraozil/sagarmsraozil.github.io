import type { SummaryData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './SummarySection.module.scss'

interface SummarySectionProps {
  data: SummaryData
}

export function SummarySection({ data }: Readonly<SummarySectionProps>) {
  return (
    <section id="summary" className={styles.summary} aria-label="Summary">
      <div className={styles.summaryInner}>
        <SectionLabel text={data.label} as="h2" />
        <p className={styles.summaryHeading}>{data.heading}</p>

        <div className={styles.summaryBody}>
          {data.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <dl className={styles.summaryLanguages}>
          {data.languages.map((lang) => (
            <div key={lang.name} className={styles.summaryLanguage}>
              <dt className={styles.summaryLanguageName}>{lang.name}</dt>
              <dd className={styles.summaryLanguageLevel}>{lang.level}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
