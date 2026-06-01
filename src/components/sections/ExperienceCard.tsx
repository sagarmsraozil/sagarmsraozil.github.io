import type { ExperienceEntry } from '@/types/portfolio'
import { StackTag } from '@/components/ui/StackTag'
import styles from './ExperienceCard.module.scss'

interface ExperienceCardProps {
  entry: ExperienceEntry
}

export function ExperienceCard({ entry }: Readonly<ExperienceCardProps>) {
  const hasStack = entry.stack && entry.stack.length > 0
  const hasGithubLinks = entry.githubLinks && entry.githubLinks.length > 0
  const hasFooter = entry.websiteUrl || hasStack || hasGithubLinks

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.cardHeaderMain}>
          <h3 className={styles.cardCompany}>{entry.company}</h3>
          <p className={styles.cardProduct}>{entry.product}</p>
          <p className={styles.cardRole}>{entry.role}</p>
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

      <div className={styles.cardBody}>
        {entry.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {hasFooter && (
        <footer className={styles.cardFooter}>
          {hasStack && (
            <div className={styles.cardStack}>
              {entry.stack!.map((item) => (
                <StackTag key={item} label={item} />
              ))}
            </div>
          )}

          <div className={styles.cardLinks}>
            {entry.websiteUrl && (
              <a
                href={entry.websiteUrl}
                className={styles.cardLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit website →
              </a>
            )}
            {entry.githubLinks?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.cardLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      )}
    </article>
  )
}
