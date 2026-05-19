import styles from './StackTag.module.scss'

interface StackTagProps {
  label: string
}

export function StackTag({ label }: Readonly<StackTagProps>) {
  return <span className={styles.stackTag}>{label}</span>
}
