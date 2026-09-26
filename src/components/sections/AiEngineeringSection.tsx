import type { AiEngineeringData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './AiEngineeringSection.module.scss'

interface AiEngineeringSectionProps {
  data: AiEngineeringData
}

export function AiEngineeringSection({ data }: Readonly<AiEngineeringSectionProps>) {
  return (
    <section id="ai-engineering" className={styles.ai} aria-label="AI-assisted engineering">
      <div className={styles.aiInner}>
        <SectionLabel text={data.label} as="h2" className={styles.aiLabel} />
        <p className={styles.aiHeading}>{data.heading}</p>

        <div className={styles.aiBody}>
          {data.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
