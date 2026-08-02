import type { EarlierProject } from '@/types/portfolio'
import { StackTag } from '@/components/ui/StackTag'
import { ResourceLinks } from '@/components/ui/ResourceLinks'
import styles from './AdditionalProjectCard.module.scss'

interface AdditionalProjectCardProps {
  project: EarlierProject
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

        {project.links && project.links.length > 0 && (
          <ResourceLinks links={project.links} />
        )}
      </footer>
    </article>
  )
}
