import styles from './Sidebar.module.scss'

interface Props {
  topAuthors: string[];
}

const SidebarTopAuthors = ({ topAuthors }: Props) => {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <h2>Most active authors</h2>
        </div>
        <div className={styles.content}>
          <div className={styles.avatarContainer}>
            {topAuthors.length
              ? topAuthors.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="author avatar"
                    className={styles.avatar}
                  />
                ))
              : 'No activity'}
          </div>
        </div>
    </div>
  )
}

export default SidebarTopAuthors