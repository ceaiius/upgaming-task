import { useState, useCallback } from 'react';
import { getCommentReactors } from '../../services/commentService';
import type { Reactor } from '../../services/reactionService';

export function useCommentReactors(commentId: number) {
  const [reactors, setReactors] = useState<Reactor[] | null>(null);
  const [loading, setLoading] = useState(false);

  const loadReactors = useCallback(async () => {
    if (reactors || loading) return;
    setLoading(true);
    try {
      setReactors(await getCommentReactors(commentId));
    } finally {
      setLoading(false);
    }
  }, [reactors, loading, commentId]);

  return { reactors, loading, loadReactors };
} 