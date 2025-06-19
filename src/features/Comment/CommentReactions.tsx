import styles from '../Reactions/Reactions.module.scss';
import { reactionOptions } from '../../constants/reactions';
import type { Comment } from '../../types/comment';
import { useCommentReactions } from '../../hooks/Comment/useCommentReactions';

interface Props {
  comment: Comment;
  postId: number;
}

const CommentReactions = ({ comment, postId }: Props) => {
  const {
    showPopup,
    containerRef,
    userReaction,
    handleMouseEnter,
    handleMouseLeave,
    handleDefaultLike,
    handleReact,
  } = useCommentReactions(comment, postId);


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