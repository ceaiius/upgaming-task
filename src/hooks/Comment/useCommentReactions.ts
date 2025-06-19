import { useRef, useState, useCallback } from 'react';
import { toggleCommentReact } from '../../services/commentService';
import { useCommentStore } from '../../store/comment';
import type { Comment } from '../../types/comment';
import type { ReactionType } from '../../services/reactionService';

export function useCommentReactions(comment: Comment, postId: number) {
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [userReaction, setUserReaction] = useState<string | null>(comment.UserReaction ?? null);
  const patchComment = useCommentStore(s => s.patchComment);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 300);
  }, []);

  const mutate = async (next: string | null, apiType: string | null) => {
    const prev = userReaction;
    setUserReaction(next);

    const newReactions = { ...comment.Reactions };
    if (prev) newReactions[prev] = Math.max(0, (newReactions[prev] || 1) - 1);
    if (next) newReactions[next] = (newReactions[next] || 0) + 1;
    patchComment(postId, {
      CommentID: comment.CommentID,
      Reactions: newReactions,
      UserReaction: next,
    });

    try {
      if (apiType) {
        await toggleCommentReact(comment.CommentID, apiType as ReactionType);
      } else {
        await toggleCommentReact(comment.CommentID);
      }
    } catch {
      setUserReaction(prev);
      patchComment(postId, {
        CommentID: comment.CommentID,
        Reactions: comment.Reactions,
        UserReaction: prev,
      });
    }
  };

  const handleDefaultLike = () =>
    mutate(userReaction ? null : 'LIKE', userReaction || 'LIKE');

  const handleReact = (t: string) =>
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