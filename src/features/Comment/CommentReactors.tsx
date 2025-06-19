import Popover from '../Reactors/Popover';
import styles from '../Reactors/Reactors.module.scss';
import { useCommentReactors } from '../../hooks/Comment/useCommentReactors';

const CommentReactors = ({ commentId, children }: { commentId: number; children: React.ReactNode }) => {
  const { reactors, loading, loadReactors } = useCommentReactors(commentId);

  return (
    <Popover
      content={
        <div>
          {loading ? (
            <div className={styles.spinner} />
          ) : reactors && reactors.length > 0 ? (
            <ul className={styles.list}>
              {reactors.map((r) => (
                <li key={r.UserID} className={styles.reactor}>
                  {r.AvatarUrl && <img src={r.AvatarUrl} alt="avatar" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }} />}
                  <span>{r.FirstName} {r.LastName} ({r.ReactionType})</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>No reactors</div>
          )}
        </div>
      }
      onOpen={loadReactors}
    >
      {children}
    </Popover>
  );
};

export default CommentReactors; 