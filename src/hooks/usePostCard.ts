import { useState, useRef, useMemo, useEffect } from 'react';
import { deletePost } from '../services/postService';
import type { Post } from '../types/post';
import type { ReactionType } from '../services/reactionService';
import { useStore } from '../store';

export function usePostCard(initial: Post, onDelete: (postId: number) => void) {
  const user = useStore((state) => state.user);
  const [showMore, setShowMore] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [post, setPost] = useState<Post>(initial);

  const isAuthor = useMemo(() => user?.UserID === post.AuthorID, [user, post.AuthorID]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleReactionChange = (
    prev: ReactionType | null,
    next: ReactionType | null
  ) => {
    setPost((p) => {
      const counts = { ...p.Reactions };
      if (prev) counts[prev] = Math.max(0, (counts[prev] || 0) - 1);
      if (next) counts[next] = (counts[next] || 0) + 1;

      const total =
        p.TotalReactions +
        (next ? 1 : 0) -
        (prev ? 1 : 0);

      let prevAuthor = (p as { prevAuthor?: string }).prevAuthor ?? p.LastReactionAuthor;
      let lastAuthor = p.LastReactionAuthor;

      if (next) {
        prevAuthor = lastAuthor;
        lastAuthor = `${user?.FirstName} ${user?.LastName}`;
      } else if (prev) {
        lastAuthor = total > 0 ? prevAuthor : undefined;
        if (total === 0) prevAuthor = undefined;
      }

      return {
        ...p,
        UserReaction: next || undefined,
        Reactions: counts,
        TotalReactions: total,
        LastReactionAuthor: lastAuthor,
        prevAuthor,
      };
    });
  };

  const handleDeletePost = async (postId: number) => {
    try {
      setIsDeleting(true);
      await deletePost(postId);
      onDelete(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    user,
    showMore, setShowMore,
    imageLoaded, setImageLoaded,
    isDeleting, setIsDeleting,
    showMenu, setShowMenu,
    menuRef,
    showCommentInput, setShowCommentInput,
    post, setPost,
    isAuthor,
    handleReactionChange,
    handleDeletePost,
  };
} 