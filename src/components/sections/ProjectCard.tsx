import type { ProjectEntry } from '@/types/portfolio'
import { StackTag } from '@/components/ui/StackTag'
import { ResourceLinks } from '@/components/ui/ResourceLinks'
import { CaseFile } from '@/components/game/CaseFile'
import styles from './ProjectCard.module.scss'

interface ProjectCardProps {
  project: ProjectEntry
}

export function ProjectCard({ project }: Readonly<ProjectCardProps>) {
  const hasLinks = project.links && project.links.length > 0

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

        {hasLinks && <ResourceLinks links={project.links!} />}

        {project.codeNote && (
          <p className={styles.cardCodeNote}>
            {project.codeNote.text}
            {project.codeNote.linkHref && project.codeNote.linkLabel && (
              <>
                {' '}
                <a href={project.codeNote.linkHref} className={styles.cardCodeNoteLink}>
                  {project.codeNote.linkLabel}
                </a>
              </>
            )}
          </p>
        )}
      </footer>
    </article>
  )
}
