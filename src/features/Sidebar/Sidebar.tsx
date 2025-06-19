import { useSidebarStats } from '../../hooks/useSidebarStats';
import SidebarCount from './SidebarCount';
import SidebarSkeleton from './SidebarSkeleton';
import SidebarTopAuthors from './SidebarTopAuthors';
import styles from './Sidebar.module.scss';
import type { Post } from '../../types/post';

interface Props {
  posts: Post[];
  loading: boolean;
}

const Sidebar = ({ posts, loading }: Props) => {
  const { weeklyCount, topAuthors } = useSidebarStats(posts);

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className={styles.sidebar}>
      <SidebarCount weeklyCount={weeklyCount} />
      <SidebarTopAuthors topAuthors={topAuthors} />
    </div>
  );
};  

export default Sidebar;