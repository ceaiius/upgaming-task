import { useEffect, useRef, useState } from 'react';
import styles from './PostCard.module.scss';
import { type Post } from '../../types/post';
import { formatPostTimestamp } from '../../utils/dateUtils';
import moreIcon from '../../assets/dots.svg';
import deleteIcon from '../../assets/delete.svg';
import { deletePost } from '../../services/postService';
import ReactionsSection from '../Reactions/Reactions';
import commentIcon from '../../assets/comment.svg';
import Reactors from '../Reactors/Reactors';
import { useStore } from '../../store';

interface Props {
  post: Post;
  onDelete: (postId: number) => void;
}

const PostCard = ({ post, onDelete }: Props) => {
  const user = useStore((state) => state.user);
  const [showMore, setShowMore] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAuthor = user?.UserID === post.AuthorID;
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const displayText = showMore || (post.Content?.length || 0) <= 180
    ? post.Content
    : `${post.Content?.slice(0, 180)}...`;

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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <img src={post.AuthorAvatarUrl} alt={post.AuthorFirstName} className={styles.avatar} />

          <div className={styles.authorDetails}>
          <div className={styles.nameAndTimestamp}>
            <span className={styles.name}>{post.AuthorFirstName} {post.AuthorLastName}</span>
            <span className={styles.timestamp}>{formatPostTimestamp(post.CreateTime)}</span>
          </div>
          <div className={styles.meta}>QA Engineer</div>
        </div>
        </div>

        {isAuthor && (
          <div className={styles.menuWrapper} ref={menuRef}>
          <button className={styles.menuButton} onClick={() => setShowMenu(!showMenu)}>
            <img src={moreIcon} alt="options" />
          </button>
          {showMenu && (
            <div className={styles.menuDropdown}>
              <div
                className={styles.menuItem}
                onClick={() => !isDeleting && handleDeletePost(post.PostID)}
              >
                {isDeleting ? (
                  <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner} />
                  </div>
                ) : (
                  <>
                    <img src={deleteIcon} alt="delete" />
                    <span>Delete</span>
                  </>
                )}
              </div>
            </div>
          )}
          </div>
        )}
      </div>



      <div className={styles.content}>
        <p>{displayText} 
        {post.Content && post.Content.length > 180 && !showMore && (
          <span className={styles.seeMore} onClick={() => setShowMore(true)}>
            See more
          </span>
        )}
        </p>
        
      </div>

      {post.PostFiles.length > 0 && (
        <div className={styles.imageWrapper}>
          {!imageLoaded && <div className={styles.imageSkeleton} />}
          <img
            src={post.PostFiles[0].FileUrl}
            alt="Post attachment"
            
            className={imageLoaded ? styles.imageVisible : styles.imageHidden}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
      <Reactors post={post} />

      <div className={styles.footer}>
      <ReactionsSection post={post} />
      <div className={styles.commentBtn}>
        <img src={commentIcon} alt="comment" />
        <span>Comment</span>
      </div>
      </div>

    </div>
  );
};

export default PostCard;
