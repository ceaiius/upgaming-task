import styles from './PostSkeleton.module.scss';

const PostSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.nameBlock}>
          <div className={styles.name} />
          <div className={styles.role} />
        </div>
      </div>
      <div className={styles.textLine} />
      <div className={styles.textLine} />
      <div className={styles.textLineShort} />
    </div>
  );
};

export default PostSkeleton;
