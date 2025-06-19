import { useState, useRef } from 'react';
import { createComment, createReply, fetchComments } from '../../services/commentService';
import { useCommentStore } from '../../store/comment';
import { useStore } from '../../store';
import type { Comment } from '../../types/comment';

export function useCommentForm(postId: number, parentId: number | null, onSubmit?: () => void) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const add = useCommentStore(s => s.addComment);
  const remove = useCommentStore(s => s.removeComment);
  const addReply = useCommentStore(s => s.addReply);
  const setComments = useCommentStore(s => s.setComments);
  const user = useStore(s => s.user);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.textContent || '';
    setText(value);
    if (value.trim() === '') {
      e.currentTarget.innerHTML = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = async () => {
    if (!text.trim()) return;
    const temp = {
      CommentID: Date.now(),  
      ParentCommentID: parentId,
      PostID: postId,
      AuthorID: user!.UserID,
      AuthorFirstName: user!.FirstName,
      AuthorLastName: user!.LastName,
      AuthorAvatar: user!.AvatarUrl ?? null,
      Content: text,
      IsAuthor: true,
      TotalReactions: 0,
      TotalReplies: 0,
      UserReaction: null,
      CreateTime: new Date().toISOString(),
      Reactions: { LIKE:0, LOVE:0, LAUGH:0, WOW:0, SAD:0, ANGRY:0 },
      Comments: [],
    };
    if (parentId) {
      addReply(postId, parentId, temp);
    } else {
      add(postId, temp);
    }
    setText('');
    if (inputRef.current) inputRef.current.textContent = '';
    if (onSubmit) onSubmit();
    setSending(true);
    try {
      const saved: Comment = parentId
        ? (await createReply(parentId, text)).data
        : (await createComment(postId, text)).data;
      remove(postId, temp.CommentID);
      if (parentId) {
        addReply(postId, parentId, saved);
      } else {
        add(postId, saved);
      }
      const all = await fetchComments(postId);
      setComments(postId, all);
    } finally {
      setSending(false);
    }
  };

  return {
    text, setText,
    sending,
    inputRef,
    handleInput,
    handlePaste,
    handleKeyDown,
    submit,
  };
} 