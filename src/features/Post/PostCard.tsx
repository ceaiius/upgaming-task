import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PostCard.module.scss';
import { type Post } from '../../types/post';
import { formatPostTimestamp } from '../../utils/dateUtils';
import moreIcon from '../../assets/dots.svg';
import deleteIcon from '../../assets/delete.svg';
import { deletePost } from '../../services/postService';
import Reactions from '../Reactions/Reactions';
import commentIcon from '../../assets/comment.svg';
import Reactors from '../Reactors/Reactors';
import { useStore } from '../../store';
import type { ReactionType } from '../../services/reactionService';
import CommentSection from '../Comment/CommentSection';
import CommentsTotal from '../Comment/CommentsTotal';
import Avatar from '../../components/Avatar/Avatar';
import { usePostCard } from '../../hooks/usePostCard';

interface Props { 
  post: Post;
  onDelete: (postId: number) => void;
}

const PostCard = ({ post: initial, onDelete }: Props) => {
  const {
    user, showMore, setShowMore, imageLoaded, setImageLoaded,
    isDeleting, showMenu, setShowMenu, menuRef,
    showCommentInput, setShowCommentInput, post, setPost,
    isAuthor, handleReactionChange, handleDeletePost
  } = usePostCard(initial, onDelete);

  const displayText = showMore || (post.Content?.length || 0) <= 180
    ? post.Content
    : `${post.Content?.slice(0, 180)}...`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <Avatar src={post.AuthorAvatarUrl} firstName={post.AuthorFirstName} lastName={post.AuthorLastName}/>

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
            loading="lazy"
            decoding="async"
            className={imageLoaded ? styles.imageVisible : styles.imageHidden}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
      <div className={styles.commentAndReactionsContainer}>
        <Reactors post={post} user={user} />
        <CommentsTotal totalComments={post.TotalComments} postId={post.PostID} onClick={() => setShowCommentInput(!showCommentInput)}/> 
      </div>

      <div className={styles.footer}>
      <Reactions post={post} onToggle={handleReactionChange} />
      <div className={styles.commentBtn} onClick={() => setShowCommentInput(!showCommentInput)}>
        <img src={commentIcon} alt="comment" />
        <span>Comment</span>
      </div>
      </div>

      {showCommentInput && (
        <div className={styles.commentForm}>
          <CommentSection postId={post.PostID} />
        </div>
      )}

    </div>
  );
};

export default PostCard;
