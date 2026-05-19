import styles from './SectionLabel.module.scss'

interface SectionLabelProps {
  text: string
  className?: string
  as?: 'p' | 'h2'
}

export function SectionLabel({ text, className, as: Tag = 'p' }: Readonly<SectionLabelProps>) {
  return (
    <Tag className={`${styles.sectionLabel} ${className ?? ''}`}>{text}</Tag>
  )
}
