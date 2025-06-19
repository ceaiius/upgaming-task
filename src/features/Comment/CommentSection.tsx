import styles from './CommentSection.module.scss'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import { useCommentSection } from '../../hooks/Comment/useCommentSection'

interface Props {
  postId: number
}

export default function CommentSection({ postId }: Props) {
  const { safeComments, loading } = useCommentSection(postId)

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
