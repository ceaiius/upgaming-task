import { useState, useRef, useEffect } from 'react';
import { deleteComment } from '../../services/commentService';
import { useCommentStore } from '../../store/comment';
import type { Comment } from '../../types/comment';

export function useCommentItem(comment: Comment, postId: number) {
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const removeComment = useCommentStore(s => s.removeComment);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(comment.CommentID);
      removeComment(postId, comment.CommentID);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return {
    replying, setReplying,
    showReplies, setShowReplies,
    showMenu, setShowMenu,
    isDeleting, setIsDeleting,
    menuRef,
    handleDelete,
  };
} 