import styles from './Sidebar.module.scss';

const SidebarSkeleton = () => {
  return (
    <div className={styles.sidebar}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.skeletonText} style={{ width: '60px' }} />
          </div>
          <div className={styles.content}>
            <div className={styles.skeletonText} style={{ width: '24px', height: '24px' }} />
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.skeletonText} style={{ width: '100px' }} />
          </div>
          <div className={styles.content}>
            <div className={styles.avatarContainer}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonAvatar} />
            </div>
          </div>
        </div>
      </div>
  )
}

export default SidebarSkeleton