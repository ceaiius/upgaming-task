import { useEffect, useState } from 'react';
import { fetchComments } from '../../services/commentService';
import { useCommentStore } from '../../store/comment';

export function useCommentSection(postId: number) {
  const setComments = useCommentStore(s => s.setComments);
  const comments = useCommentStore(s => s.byPost[postId]);
  const safeComments = comments ?? [];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comments !== undefined) return;
    setLoading(true);
    fetchComments(postId)
      .then(list => setComments(postId, list))
      .catch((err: unknown) => console.error('Failed to load comments', err))
      .finally(() => setLoading(false));
  }, [postId, setComments, comments]);

  return { safeComments, loading };
} 