import styles from './Sidebar.module.scss'

interface Props {
  weeklyCount: number;
}

const SidebarCount = ({ weeklyCount }: Props) => {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <h2>Total posts this week</h2>
        </div>
        <div className={styles.content}>
          <span>{weeklyCount}</span>
        </div>
    </div>
  )
}

export default SidebarCount