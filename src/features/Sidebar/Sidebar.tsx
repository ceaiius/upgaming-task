import  { useMemo } from 'react';
import styles from './Sidebar.module.scss';
import { type Post } from '../../types/post';
import SidebarSkeleton from './SidebarSkeleton';

interface Props {
  posts: Post[];
  loading: boolean;
}

const Sidebar = ({ posts, loading }: Props) => {
  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const weeklyCount = useMemo(
    () =>
      posts.filter((p) => new Date(p.CreateTime) >= weekAgo).length,
    [posts, weekAgo]
  );

  const topAuthors = useMemo(() => {
    const counts: Record<string, { count: number; avatar: string }> = {};

    for (const p of posts) {
      const created = new Date(p.CreateTime);
      if (created < weekAgo) continue;
      const key = `${p.AuthorID}`;
      if (!counts[key]) {
        counts[key] = {
          count: 0,
          avatar: p.AuthorAvatarUrl || 'src/assets/avatar-default.svg',
        };
      }
      counts[key].count++;
    }

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((a) => a.avatar);
  }, [posts, weekAgo]);

  if (loading) {
    return (
      <SidebarSkeleton/>
    );
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Total posts this week</h2>
        </div>
        <div className={styles.content}>
          <span>{weeklyCount}</span>
        </div>
      </div>

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
    </div>
  );
};

export default Sidebar;
