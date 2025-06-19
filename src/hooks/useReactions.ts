import { useRef, useState, useCallback } from 'react';
import { toggleReaction } from '../services/reactionService';
import { type ReactionType } from '../services/reactionService';
import { type Post } from '../types/post';

export function useReactions(post: Post, onToggle: (prev: ReactionType|null, next: ReactionType|null) => void) {
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(post.UserReaction ?? null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 300);
  }, []);

  const mutate = async (next: ReactionType|null, apiType: ReactionType|null) => {
    const prev = userReaction;
    setUserReaction(next);
    onToggle(prev, next);
    try {
      if (apiType) {
        await toggleReaction(post.PostID, apiType);
      }
    } catch {
      setUserReaction(prev);
      onToggle(next, prev);
    }
  };

  const handleDefaultLike = () =>
    mutate(userReaction ? null : 'LIKE', userReaction || 'LIKE');

  const handleReact = (t: ReactionType) =>
    mutate(userReaction === t ? null : t, t);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 100);
  }, []);

  return {
    showPopup,
    containerRef,
    userReaction,
    handleMouseEnter,
    handleMouseLeave,
    handleDefaultLike,
    handleReact,
  };
} 