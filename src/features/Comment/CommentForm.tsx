import { useState, useRef } from 'react';
import styles from './CommentForm.module.scss';
import { createComment, createReply } from '../../services/commentService';
import { useCommentStore } from '../../store/comment';
import { useStore } from '../../store';

interface Props {
  postId: number;
  parentId: number | null;
}

const CommentForm = ({ postId, parentId }: Props) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const add = useCommentStore(s => s.addComment);
  const remove = useCommentStore(s => s.removeComment);
  const addReply = useCommentStore(s => s.addReply);
  const user = useStore(s => s.user);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.textContent || '');
  };

  const submit = async () => {
    if (!text.trim()) return;
    const temp = {
      CommentID: Date.now(),  // temp id
      ParentCommentID: parentId,
      PostID: postId,
      AuthorID: user!.UserID,
      AuthorFirstName: user!.FirstName,
      AuthorLastName: user!.LastName,
      AuthorAvatar: user!.AvatarUrl,
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
    setSending(true);
    try {
      const saved = parentId
        ? (await createReply(parentId, text)).data
        : (await createComment(postId, text)).data;
      remove(postId, temp.CommentID);
      if (parentId) {
        addReply(postId, parentId, saved);
      } else {
        add(postId, saved);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputWrapper}>
        <div
          className={styles.editable}
          contentEditable={!sending}
          ref={inputRef}
          onInput={handleInput}
          data-placeholder={parentId ? 'Write a reply…' : 'Write your comment'}
          role="textbox"
          aria-multiline="true"
          tabIndex={0}
          suppressContentEditableWarning
        />
        <button
          className={styles.submitBtn}
          onClick={submit}
          disabled={sending || !text.trim()}
          type="button"
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default CommentForm;
