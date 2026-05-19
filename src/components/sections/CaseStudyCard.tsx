import type { CaseStudy } from '@/types/portfolio'
import { StackTag } from '@/components/ui/StackTag'
import styles from './CaseStudyCard.module.scss'

interface CaseStudyCardProps {
  study: CaseStudy
}

export function CaseStudyCard({ study }: Readonly<CaseStudyCardProps>) {
  return (
    <article className={styles.caseStudy}>
      <div className={styles.caseStudyTags}>
        {study.tags.map((tag) => (
          <span key={tag} className={styles.caseStudyTag}>
            {tag}
          </span>
        ))}
      </div>

      <h3 className={styles.caseStudyTitle}>{study.title}</h3>

      <div className={styles.caseStudyBody}>
        {study.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <footer className={styles.caseStudyFooter}>
        <div className={styles.caseStudyStack}>
          {study.stack.map((item) => (
            <StackTag key={item} label={item} />
          ))}
        </div>

        {study.github && (
          <a
            href={study.github}
            className={styles.caseStudyGithubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub →
          </a>
        )}
      </footer>
    </article>
  )
}
