import styles from './Reactors.module.scss';
import { type Post } from '../../types/post';
import { reactionOptions } from '../../constants/reactions';

interface Props {
  post: Post;
}

const Reactors = ({ post }: Props) => {
  const { TotalReactions, LastReactionAuthor, Reactions } = post;

  if (!TotalReactions) return null;

  const topReactions = Object.entries(Reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);

  return (
    <div className={styles.summary}>
      <div className={styles.icons}>
        {topReactions.map((t) => {
          const data = reactionOptions.find((r) => r.type === t);
          return data ? <img key={t} src={data.icon} alt={data.label} /> : null;
        })}
      </div>

      <span className={styles.text}>
        {LastReactionAuthor}
        {TotalReactions > 1 && ` and ${TotalReactions - 1} others`}
      </span>
    </div>
  );
};

export default Reactors;
