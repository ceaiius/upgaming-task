import  { useMemo } from 'react';
import styles from './Sidebar.module.scss';
import { type Post } from '../../types/post';
import SidebarSkeleton from './SidebarSkeleton';
import SidebarCount from './SidebarCount';
import SidebarTopAuthors from './SidebarTopAuthors';

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
      .slice(0, 8)
      .map((a) => a.avatar);
  }, [posts, weekAgo]);

  if (loading) {
    return (
      <SidebarSkeleton/>
    );
  }

  return (
    <div className={styles.sidebar}>
      <SidebarCount weeklyCount={weeklyCount} />
      <SidebarTopAuthors topAuthors={topAuthors} />
    </div>
  );
};

export default Sidebar;
