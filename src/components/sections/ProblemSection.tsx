import type { ProblemData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './ProblemSection.module.scss'

interface ProblemSectionProps {
  data: ProblemData
}

export function ProblemSection({ data }: Readonly<ProblemSectionProps>) {
  return (
    <section className={styles.problem} aria-label="Philosophy">
      <div className={styles.problemInner}>
        <SectionLabel text={data.label} />
        <h2 className={styles.problemHeading}>{data.heading}</h2>
        <hr className={styles.problemDivider} />
        <div className={styles.problemBody}>
          {data.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
