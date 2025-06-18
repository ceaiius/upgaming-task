import styles from './CommentsTotal.module.scss'
import Popover from '../Reactors/Popover'
import { fetchCommentAuthors } from '../../services/commentService'
import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Commenter } from '../../types/commenter'

interface Props {
    totalComments: number
    postId: number
    onClick: () => void
}

const CommentsAuthorsPopover = ({ postId, children, onAuthorsChange }: { postId: number; children: ReactNode; onAuthorsChange?: (count: number) => void }) => {
  const [authors, setAuthors] = useState<Commenter[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadAuthors = useCallback(async () => {
    if (loaded || loading) return
    setLoading(true)
    try {
      const commenters = await fetchCommentAuthors(postId)

      const mapped = commenters.map((c: any) => ({
        UserID: c.UserID,
        FirstName: c.FirstName,
        LastName: c.LastName,
      }))
      setAuthors(mapped)
      setLoaded(true)
      if (onAuthorsChange) onAuthorsChange(mapped.length)
    } finally {
      setLoading(false)
    }
  }, [postId, loaded, loading, onAuthorsChange])

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

const CommentsTotal = ({ totalComments, postId, onClick }: Props) => {
  const [count, setCount] = useState(totalComments)
  if (count === 0) return null;
  return (
    <CommentsAuthorsPopover postId={postId} onAuthorsChange={setCount}>
      <div className={styles.commentsTotal} onClick={onClick}>{count} Comments</div>
    </CommentsAuthorsPopover>
  );
}

export default CommentsTotal