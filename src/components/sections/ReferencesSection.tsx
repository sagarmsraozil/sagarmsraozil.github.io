import type { ReferencesData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './ReferencesSection.module.scss'

interface ReferencesSectionProps {
  data: ReferencesData
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts[parts.length - 1]?.[0] ?? ''
  return (first + last).toUpperCase()
}

export function ReferencesSection({ data }: Readonly<ReferencesSectionProps>) {
  return (
    <section className={styles.references} aria-label="References">
      <div className={styles.referencesInner}>
        <SectionLabel text={data.label} as="h2" />
        <p className={styles.referencesHeading}>{data.heading}</p>

        <ul className={styles.referencesList} role="list">
          {data.people.map((person) => (
            <li key={person.name} className={styles.referencesItem}>
              <div className={styles.referencesAvatar} aria-hidden="true">
                {getInitials(person.name)}
              </div>

              <div className={styles.referencesInfo}>
                <span className={styles.referencesName}>{person.name}</span>
                <span className={styles.referencesRole}>
                  {person.role}
                  <span className={styles.referencesDot} aria-hidden="true">·</span>
                  {person.company}
                </span>
              </div>

              <a
                href={person.linkedinUrl}
                className={styles.referencesLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} on LinkedIn`}
              >
                LinkedIn ↗
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.referencesClosing}>{data.closing}</p>
      </div>
    </section>
  )
}
