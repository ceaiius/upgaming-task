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
  const [userReaction, setUserReaction] = useState<ReactionType | null>(post.UserReaction ?? null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 300); 
  }, []);

  const handleDefaultLike = async () => {
    if (userReaction) {
      const toRemove = userReaction;
      setUserReaction(null);
      try {
        await toggleReaction(post.PostID, toRemove);
      } catch {
        setUserReaction(toRemove);
      }
    } else {

      setUserReaction('LIKE');
      try {
        await toggleReaction(post.PostID, 'LIKE');
      } catch {
        setUserReaction(null);
      }
    }
  };
  

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 100);
  }, []);

  const handleReact = async (type: ReactionType) => {
    const newReaction = userReaction === type ? null : type;
  
    setUserReaction(newReaction);
  
    try {
      await toggleReaction(post.PostID, type);
    } catch (err) {
      setUserReaction(userReaction);
    } finally {
      setShowPopup(false);
    }
  };

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

export default ReactionsSection;
