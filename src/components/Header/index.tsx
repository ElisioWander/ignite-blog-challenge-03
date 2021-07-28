import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/Logo.svg" alt="Logo" />
      </div>
    </header>
  )
}
