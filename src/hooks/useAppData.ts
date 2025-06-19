import { useEffect, useState } from 'react';
import { fetchUser } from '../services/userService';
import { fetchAllPosts } from '../services/postService';
import { useStore } from '../store';
import { useReactionStore } from '../store/reactions';
import type { Post } from '../types/post';

export function useAppData() {
  const { setUser, user } = useStore();
  const { fetchReactionTypes } = useReactionStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [postsData, userData] = await Promise.all([
          fetchAllPosts(),
          fetchUser(),
        ]);
        setPosts(postsData);
        setUser(userData);
        fetchReactionTypes();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [setUser, fetchReactionTypes]);

  return { posts, setPosts, user, loading, error };
}