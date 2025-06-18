// features/Comment/CommentItem.tsx
import { useState, useRef, useEffect } from 'react'
import styles from './CommentItem.module.scss'
import type { Comment } from '../../types/comment'
import CommentForm from './CommentForm'
import moreIcon from '../../assets/dots.svg'
import deleteIcon from '../../assets/Delete.svg'
import { deleteComment } from '../../services/commentService'
import { useCommentStore } from '../../store/comment'

interface Props {
  comment: Comment
  postId: number
  isRoot?: boolean
}

export default function CommentItem({ comment, postId, isRoot = false }: Props) {
  const [replying, setReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const removeComment = useCommentStore(s => s.removeComment)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMenu])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteComment(comment.CommentID)
      removeComment(postId, comment.CommentID)
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  const hasReplies = Array.isArray(comment.Comments) && comment.Comments.length > 0;

  return (
    <li className={styles.item + (isRoot ? ' ' + styles.isRoot : '') + (hasReplies ? ' ' + styles.hasReplies : '')}>
      <div className={styles.commentBox}>
        <div className={styles.row}>
          <img src={comment.AuthorAvatar || '/default-avatar.png'} className={styles.avatar} />
          <div className={styles.body}>
            <div className={styles.metaRow}>
              <div>
                <span className={styles.name}>{comment.AuthorFirstName} {comment.AuthorLastName}</span>
                <span className={styles.role}>Graphic Designer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
                <span className={styles.time}>{new Date(comment.CreateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
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
              <span className={styles.action}>Like</span>
              <span className={styles.action} onClick={() => setReplying(r => !r)}>Reply</span>
            </div>
            {replying && (
              <CommentForm postId={postId} parentId={comment.CommentID} onSubmit={() => setReplying(false)} />
            )}
            {isRoot && hasReplies && (
              <div className={styles.showReplies} onClick={() => setShowReplies(r => !r)}>
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
