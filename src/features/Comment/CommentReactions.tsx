import { useRef, useState, useCallback } from 'react';
import styles from '../Reactions/Reactions.module.scss';
import { reactionOptions } from '../../constants/reactions';
import { toggleCommentReact } from '../../services/commentService';
import type { Comment } from '../../types/comment';
import type { ReactionType } from '../../services/reactionService';
import { useCommentStore } from '../../store/comment';

interface Props {
  comment: Comment;
  postId: number;
}

const CommentReactions = ({ comment, postId }: Props) => {
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

  const activeReaction = reactionOptions.find((r) => r.type === userReaction);
  const displayLabel = activeReaction?.label || 'Like';
  const displayColor = activeReaction?.color || '#6b6b6b';

  return (
    <div className={styles.reactionFooter}>
      <div
        className={styles.reactionContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        <div
          className={styles.reactBtn}
          onClick={handleDefaultLike}
        >
          <div className={`${styles.reactBtnContent} ${styles.comment}`}>
            <span style={{ color: displayColor }}>{displayLabel}</span>
          </div>
        </div>
        <div className={`${styles.reactionPopup} ${showPopup ? styles.show : ''}`}>
          {reactionOptions.map(({ type, icon, label }) => (
            <img
              key={type}
              src={icon}
              alt={label}
              title={label}
              className={styles.reactionIcon}
              onClick={() => handleReact(type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentReactions; 