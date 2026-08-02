import type { ResourceLinkData } from '@/types/portfolio'
import { ExternalIcon, GithubIcon } from './icons'
import styles from './ResourceLinks.module.scss'

interface ResourceLinksProps {
  links: ResourceLinkData[]
  label?: string
}

export function ResourceLinks({ links, label }: Readonly<ResourceLinksProps>) {
  if (links.length === 0) return null

  const allRepos = links.every((link) => link.kind === 'repo')
  const groupLabel = label ?? (allRepos ? 'Source' : 'Visit')

  return (
    <div className={styles.group}>
      <p className={styles.groupLabel}>{groupLabel}</p>

      <div className={styles.chips}>
        {links.map((link) => {
          const Icon = link.kind === 'repo' ? GithubIcon : ExternalIcon
          return (
            <a
              key={link.href}
              href={link.href}
              className={styles.chip}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className={styles.chipIcon} />
              <span className={styles.chipText}>
                <span className={styles.chipLabel}>{link.label}</span>
                {link.note && <span className={styles.chipNote}>{link.note}</span>}
              </span>
              <span className={styles.visuallyHidden}>(opens in a new tab)</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
