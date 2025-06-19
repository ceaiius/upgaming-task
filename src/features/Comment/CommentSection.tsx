import { useEffect, useState } from 'react'
import styles from './CommentSection.module.scss'
import { fetchComments } from '../../services/commentService'
import { useCommentStore } from '../../store/comment'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

interface Props {
  postId: number
}

export default function CommentSection({ postId }: Props) {
  const setComments = useCommentStore(s => s.setComments)
  const comments = useCommentStore(s => s.byPost[postId])
  const safeComments = comments ?? []
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (comments && comments.length > 0) return;
    setLoading(true)
    fetchComments(postId)
      .then(list => setComments(postId, list)) 
      .catch((err: unknown) => console.error('Failed to load comments', err))
      .finally(() => setLoading(false))
  }, [postId, setComments, comments])

  return (
    <div className={styles.section}>
      <CommentForm postId={postId} parentId={null} />
      {loading
        ? <div className={styles.loader}>Loading comments…</div>
        : <CommentList postId={postId} comments={safeComments} />
      }
    </div>
  )
}
