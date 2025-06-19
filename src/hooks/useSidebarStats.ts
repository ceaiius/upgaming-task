import { useMemo } from 'react';
import { type Post } from '../types/post';

export function useSidebarStats(posts: Post[]) {
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
    const counts: Record<string, { count: number; avatar: string; firstName: string; lastName: string }> = {};

    for (const p of posts) {
      const created = new Date(p.CreateTime);
      if (created < weekAgo) continue;
      const key = `${p.AuthorID}`;
      if (!counts[key]) {
        counts[key] = {
          count: 0,
          avatar: p.AuthorAvatarUrl || '',
          firstName: p.AuthorFirstName,
          lastName: p.AuthorLastName,
        };
      }
      counts[key].count++;
    }

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [posts, weekAgo]);

  return { weeklyCount, topAuthors };
}