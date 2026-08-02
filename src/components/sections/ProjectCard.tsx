import type { ProjectEntry } from '@/types/portfolio'
import { StackTag } from '@/components/ui/StackTag'
import { CaseFile } from '@/components/game/CaseFile'
import styles from './ProjectCard.module.scss'

interface ProjectCardProps {
  project: ProjectEntry
}

export function ProjectCard({ project }: Readonly<ProjectCardProps>) {
  const hasLinks = project.websiteUrl || project.githubLinks.length > 0

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h3 className={styles.cardName}>{project.name}</h3>
        <time className={styles.cardPeriod}>{project.period}</time>
      </header>

      <p className={styles.cardDescription}>{project.description}</p>

      <div className={styles.cardTags}>
        {project.tags.map((tag) => (
          <span key={tag} className={styles.cardTag}>
            {tag}
          </span>
        ))}
      </div>

      {project.case && <CaseFile caseId={project.id} data={project.case} />}

      <ul className={styles.cardBullets}>
        {project.bullets.map((bullet) => (
          <li key={bullet} className={styles.cardBullet}>
            {bullet}
          </li>
        ))}
      </ul>

      <footer className={styles.cardFooter}>
        <div className={styles.cardStack}>
          {project.stack.map((item) => (
            <StackTag key={item} label={item} />
          ))}
        </div>

        {hasLinks && (
          <div className={styles.cardLinks}>
            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                className={styles.cardLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit website →
              </a>
            )}
            {project.githubLinks.map((link) => (
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
        )}
      </footer>
    </article>
  )
}
