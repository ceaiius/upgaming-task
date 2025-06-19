import { reactionOptions } from '../../constants/reactions';
import styles from './Reactions.module.scss';
import likeIcon from '../../assets/like.svg';
import { type ReactionType } from '../../services/reactionService';
import { type Post } from '../../types/post';
import { useReactions } from '../../hooks/useReactions';

interface Props {
  post: Post;
  onToggle: (prev: ReactionType|null, next: ReactionType|null) => void;
}

const Reactions = ({ post, onToggle }: Props) => {
  const {
    showPopup,
    containerRef,
    userReaction,
    handleMouseEnter,
    handleMouseLeave,
    handleDefaultLike,
    handleReact,
  } = useReactions(post, onToggle);

  const activeReaction = reactionOptions.find((r) => r.type === userReaction);
  const displayIcon = activeReaction?.icon || likeIcon;
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
            <div className={styles.reactBtnContent}>
                <img src={displayIcon} alt={displayLabel} className={styles.reactionIconMain}/>
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

export default Reactions;
