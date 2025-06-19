import { useState, useCallback, useEffect } from 'react';
import { getPostReactors, type Reactor } from '../services/reactionService';
import type { Post } from '../types/post';
import type { User } from '../services/userService';

export function useReactors(post: Post, user: User | null) {
  const { PostID, UserReaction, LastReactionAuthor } = post;
  const [allReactors, setAllReactors] = useState<Reactor[] | null>(null);
  const [loading, setLoading] = useState(false);

  const loadReactors = useCallback(async () => {
    if (allReactors || loading) return;
    setLoading(true);
    try {
      setAllReactors(await getPostReactors(PostID));
    } finally {
      setLoading(false);
    }
  }, [allReactors, loading, PostID]);

  useEffect(() => {
    if (!user) return;
    setAllReactors(prev => {
      if (!prev) return prev;
      const meIdx = prev.findIndex(r => r.UserID === user.UserID);
      const nextType = UserReaction;
      let list = meIdx !== -1
        ? prev.filter(r => r.UserID !== user.UserID)
        : prev;
      if (nextType) {
        list = [
          {
            UserID: user.UserID,
            FirstName: user.FirstName,
            LastName: user.LastName,
            AvatarUrl: user.AvatarUrl,
            ReactionType: nextType,
          },
          ...list,
        ];
      }
      if (list.length === prev.length && list.every((r, i) => r === prev[i])) {
        return prev;
      }
      return list;
    });
  }, [UserReaction, user]);

  return { allReactors, loading, loadReactors, LastReactionAuthor };
}