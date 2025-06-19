import styles from './CommentsTotal.module.scss'
import Popover from '../Reactors/Popover'
import { fetchCommentAuthors } from '../../services/commentService'
import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Commenter } from '../../types/commenter'
import { useCommentStore } from '../../store/comment'

interface Props {
    postId: number
    totalComments: number
    onClick: () => void
}

function countAllComments(comments: any[]): number {
  if (!comments) return 0;
  return comments.reduce(
    (acc, c) => acc + 1 + countAllComments(c.Comments),
    0
  );
}

const CommentsAuthorsPopover = ({ postId, children }: { postId: number; children: ReactNode }) => {
  const [authors, setAuthors] = useState<Commenter[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadAuthors = useCallback(async () => {
    if (loaded || loading) return
    setLoading(true)
    try {
      const commenters = await fetchCommentAuthors(postId)

      const mapped = commenters.map((c: Commenter) => ({
        UserID: c.UserID,
        FirstName: c.FirstName,
        LastName: c.LastName,
      }))
      setAuthors(mapped)
      setLoaded(true)
    } finally {
      setLoading(false)
    }
  }, [postId, loaded, loading])

  return (
    <Popover
      content={
        <div className={styles.popoverContent}>
          {loading ? (
            <div className={styles.spinner} />
          ) : authors.length === 0 ? (
            <div>No comment authors</div>
          ) : (
            <ul className={styles.popoverList}>
              {authors.map((a) => (
                <li key={a.UserID} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <span>{a.FirstName} {a.LastName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
      onOpen={loadAuthors}
    >
      <span className={styles.commentsTotal} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </Popover>
  )
}

const CommentsTotal = ({ postId, totalComments, onClick }: Props) => {
  const comments = useCommentStore(s => s.byPost[postId]);
  const storeCount = comments ? countAllComments(comments) : undefined;
  const count = typeof storeCount === 'number' ? storeCount : totalComments;
  if (count === 0) return null;
  return (
    <CommentsAuthorsPopover postId={postId}>
      <div className={styles.commentsTotal} onClick={onClick}>{count} Comments</div>
    </CommentsAuthorsPopover>
  );
}

export default CommentsTotal