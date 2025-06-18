// features/Comment/CommentList.tsx
import CommentItem from './CommentItem';
import type { Comment } from '../../services/commentService';
import styles from './CommentList.module.scss';

interface Props {
  postId: number;
  comments: Comment[];
}

const CommentList = ({ postId, comments }: Props) => (
  <div className={styles.commentList}>
      <ul className={styles.ul}>
      {comments.map(c => (
        <CommentItem key={c.CommentID} comment={c} postId={postId} isRoot={true} />
      ))}
    </ul>
  </div>
);

export default CommentList;
