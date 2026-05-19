import type { SkillsData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './SkillsSection.module.scss'

interface SkillsSectionProps {
  data: SkillsData
}

export function SkillsSection({ data }: Readonly<SkillsSectionProps>) {
  return (
    <section className={styles.skills} aria-label="Skills">
      <div className={styles.skillsInner}>
        <SectionLabel text={data.label} as="h2" />
        <div className={styles.skillsList}>
          {data.categories.map((category) => (
            <div key={category.name} className={styles.skillsItem}>
              <h3 className={styles.skillsCategoryName}>{category.name}</h3>
              <p className={styles.skillsCategoryItems}>{category.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
