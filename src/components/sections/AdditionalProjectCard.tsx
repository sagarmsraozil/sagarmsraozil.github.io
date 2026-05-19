import type { AdditionalProject } from '@/types/portfolio'
import { StackTag } from '@/components/ui/StackTag'
import styles from './AdditionalProjectCard.module.scss'

interface AdditionalProjectCardProps {
  project: AdditionalProject
}

export function AdditionalProjectCard({ project }: Readonly<AdditionalProjectCardProps>) {
  return (
    <article className={styles.projectCard}>
      <header className={styles.projectCardHeader}>
        <h3 className={styles.projectCardName}>{project.name}</h3>
        <time className={styles.projectCardPeriod}>{project.period}</time>
      </header>

      <div className={styles.projectCardTags}>
        {project.tags.map((tag) => (
          <span key={tag} className={styles.projectCardTag}>
            {tag}
          </span>
        ))}
      </div>

      <p className={styles.projectCardSummary}>{project.summary}</p>

      <footer className={styles.projectCardFooter}>
        <div className={styles.projectCardStack}>
          {project.stack.map((item) => (
            <StackTag key={item} label={item} />
          ))}
        </div>

        {project.githubLinks.length > 0 && (
          <div className={styles.projectCardLinks}>
            {project.githubLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.projectCardLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </footer>
    </article>
  )
}
