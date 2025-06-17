import { useRef, useState, useCallback } from 'react';
import styles from './Reactions.module.scss';
import { type ReactionType } from '../../services/reactionService';
import { toggleReaction } from '../../services/reactionService';
import { type Post } from '../../types/post';
import likeIcon from '../../assets/like.svg';
import { reactionOptions } from '../../constants/reactions';

interface Props {
  post: Post;
}

const ReactionsSection = ({ post }: Props) => {
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowPopup(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 50); 
  }, []);

  const handleReact = async (type: ReactionType) => {
    try {
      await toggleReaction(post.PostID, type);
    } catch (err) {
      console.error('Failed to react:', err);
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className={styles.reactionFooter}>
      <div
        className={styles.reactionContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        <div className={styles.reactBtn}>
          <div className={styles.reactBtnContent}>
            <img src={likeIcon} alt="like" />
            <span>Like</span>
          </div>
        </div>
        {showPopup && (
          <div className={styles.reactionPopup}>
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
        )}
      </div>
    </div>
  );
};

export default ReactionsSection;
