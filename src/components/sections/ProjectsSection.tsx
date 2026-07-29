import type { ProjectsData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ProjectCard } from './ProjectCard'
import { AdditionalProjectCard } from './AdditionalProjectCard'
import styles from './ProjectsSection.module.scss'

interface ProjectsSectionProps {
  data: ProjectsData
}

export function ProjectsSection({ data }: Readonly<ProjectsSectionProps>) {
  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      <div className={styles.projectsInner}>
        <SectionLabel text={data.label} />
        <h2 className={styles.projectsHeading}>{data.heading}</h2>

        <div className={styles.projectsEntries}>
          {data.entries.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {data.earlier.length > 0 && (
          <div className={styles.projectsEarlier}>
            <SectionLabel text={data.earlierLabel} className={styles.projectsEarlierLabel} />
            <div className={styles.projectsEarlierList}>
              {data.earlier.map((project) => (
                <AdditionalProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
