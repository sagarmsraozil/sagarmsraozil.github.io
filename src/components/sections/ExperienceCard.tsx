import type { ExperienceEntry } from '@/types/portfolio'
import { StackTag } from '@/components/ui/StackTag'
import { ResourceLinks } from '@/components/ui/ResourceLinks'
import { CaseFile } from '@/components/game/CaseFile'
import styles from './ExperienceCard.module.scss'

interface ExperienceCardProps {
  entry: ExperienceEntry
}

export function ExperienceCard({ entry }: Readonly<ExperienceCardProps>) {
  const hasStack = entry.stack && entry.stack.length > 0
  const hasLinks = entry.links && entry.links.length > 0

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.cardHeaderMain}>
          <h3 className={styles.cardCompany}>{entry.company}</h3>
          <p className={styles.cardRole}>{entry.role}</p>
          <p className={styles.cardProduct}>{entry.product}</p>
        </div>
        <div className={styles.cardHeaderMeta}>
          <time className={styles.cardPeriod}>{entry.period}</time>
          <span className={styles.cardLocation}>{entry.location}</span>
        </div>
      </header>

      <div className={styles.cardTags}>
        {entry.tags.map((tag) => (
          <span key={tag} className={styles.cardTag}>
            {tag}
          </span>
        ))}
      </div>

      {entry.case && <CaseFile caseId={entry.id} data={entry.case} />}

      <ul className={styles.cardBullets}>
        {entry.bullets.map((bullet) => (
          <li key={bullet} className={styles.cardBullet}>
            {bullet}
          </li>
        ))}
      </ul>

      {(hasStack || hasLinks) && (
        <footer className={styles.cardFooter}>
          {hasStack && (
            <div className={styles.cardStack}>
              {entry.stack!.map((item) => (
                <StackTag key={item} label={item} />
              ))}
            </div>
          )}

          {hasLinks && <ResourceLinks links={entry.links!} />}
        </footer>
      )}
    </article>
  )
}
