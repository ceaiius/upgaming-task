import { useCommentItem } from '../../hooks/Comment/useCommentItem';
import styles from './CommentItem.module.scss'
import type { Comment } from '../../types/comment'
import CommentForm from './CommentForm'
import moreIcon from '../../assets/dots.svg'
import deleteIcon from '../../assets/delete.svg'
import CommentReactions from './CommentReactions'
import { reactionOptions } from '../../constants/reactions'
import Avatar from '../../components/Avatar/Avatar'
import { formatPostTimestamp } from '../../utils/dateUtils'

interface Props {
  comment: Comment
  postId: number
  isRoot?: boolean
}

export default function CommentItem({ comment, postId, isRoot = false }: Props) {
  const {
    replying, setReplying,
    showReplies, setShowReplies,
    showMenu, setShowMenu,
    isDeleting,
    menuRef,
    handleDelete,
  } = useCommentItem(comment, postId);

  const commentDate = formatPostTimestamp(comment.CreateTime, 'relative')

  const hasReplies = Array.isArray(comment.Comments) && comment.Comments.length > 0;

  const reactionCounts = comment.Reactions || {};
  const sortedTypes = Object.entries(reactionCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);
  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

  let reactionDisplay = null;
  if (totalReactions === 0) {
    reactionDisplay = <div className={styles.circle}></div>;
  } else if (sortedTypes.length > 0) {
    reactionDisplay = (
      <span className={styles.reactionIcons}>
        {sortedTypes.map(type => {
          const option = reactionOptions.find(r => r.type === type);
          return option ? (
            <img key={type} src={option.icon} alt={option.label} className={styles.reactionIconSmall} />
          ) : null;
        })}
        <span className={styles.reactionCount}>
          <span>{totalReactions}</span>
          <div className={styles.circle}></div>
        </span>
      </span>
    );
  }

  return (
    <li className={styles.item + (isRoot ? ' ' + styles.isRoot : '') + (hasReplies ? ' ' + styles.hasReplies : '')}>
      <div className={styles.commentBox}>
        <div className={styles.row}>
          <Avatar src={comment.AuthorAvatar} firstName={comment.AuthorFirstName} lastName={comment.AuthorLastName} />
          <div className={styles.body}>
            <div className={styles.metaRow}>
              <div>
                <span className={styles.name}>{comment.AuthorFirstName} {comment.AuthorLastName}</span>
                <span className={styles.role}>Graphic Designer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
                <span className={styles.time}>{commentDate}</span>
                {comment.IsAuthor && (
                  <div className={styles.menuWrapper} ref={menuRef}>
                    <button className={styles.menuButton} onClick={() => setShowMenu(v => !v)}>
                      <img src={moreIcon} alt="options" />
                    </button>
                    {showMenu && (
                      <div className={styles.menuDropdown}>
                        <div
                          className={styles.menuItem}
                          onClick={() => !isDeleting && handleDelete()}
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
            </div>
            <div className={styles.content}>{comment.Content}</div>
            <div className={styles.actions}>
              <CommentReactions comment={comment} postId={postId} />
              {reactionDisplay}
              <span className={styles.action} onClick={() => setReplying(r => !r)}>Reply</span>
            </div>
            {replying && (
              <CommentForm postId={postId} parentId={comment.CommentID} onSubmit={() => {
                setReplying(false);
                setShowReplies(true);
              }} />
            )}
            {hasReplies && (
              <div className={styles.showReplies} onClick={() => setShowReplies(r =>  !r)}>
                {showReplies ? `Hide replies (${comment.Comments.length})` : `Show replies (${comment.Comments.length})`}
              </div>
            )}
          </div>
        </div>
      </div>
      {showReplies && hasReplies && (
        <ul className={styles.replies}>
          {comment.Comments.map(r => (
            <CommentItem key={r.CommentID} comment={r} postId={postId} isRoot={false} />
          ))}
        </ul>
      )}
    </li>
  )
}
