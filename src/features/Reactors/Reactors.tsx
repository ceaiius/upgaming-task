import styles from './Reactors.module.scss';
import { type Post } from '../../types/post';
import { reactionOptions } from '../../constants/reactions';
import type { User } from '../../services/userService';
import { useMemo } from 'react';
import Popover from './Popover';
import { useReactors } from '../../hooks/useReactors';

const DISPLAY_LIMIT = 6;

interface Props {
  post: Post;
  user: User | null;
}

const Reactors = ({ post, user }: Props) => {
  const {
    TotalReactions,
    Reactions,
    UserReaction,
    AuthorID,
  } = post;

  const { allReactors, loading, loadReactors, LastReactionAuthor } = useReactors(post, user);

  const topTypes = useMemo(() =>
    Object.entries(Reactions)
      .filter(([,c]) => c>0)
      .sort((a,b) => b[1]-a[1])
      .slice(0,3)
      .map(([t]) => t)
  , [Reactions]);

  const isSolo =
    TotalReactions === 1 &&
    UserReaction &&
    user?.UserID === AuthorID;

  const makeList = (filterType?: string) => {
    const headerLabel = filterType
      && reactionOptions.find((r) => r.type === filterType)!.label

    if (loading) {
      return (
        <>
          <div className={styles.header}>{headerLabel}</div>
          <div className={styles.spinner} />
        </>
      );
    }

    const list = allReactors || [];
    const filtered = filterType
      ? list.filter((r) => r.ReactionType === filterType)
      : list;

    const slice = filtered.slice(0, DISPLAY_LIMIT);

    return (
      <>
        <ul className={styles.list}>
          {headerLabel && <li>{headerLabel}</li>}
          {slice.map((r) => (
            <li key={r.UserID} className={styles.reactor}>
              {r.FirstName} {r.LastName}
            </li>
          ))}
          {filtered.length > DISPLAY_LIMIT && (
            <li className={styles.more}>… and more</li>
          )}
          {filtered.length === 0 && (
            <li className={styles.empty}>No reactors</li>
          )}
        </ul>
      </>
    );
  };

  let displayName = LastReactionAuthor;
  if (allReactors && allReactors.length > 0) {
    if (user && allReactors[0].UserID === user.UserID) {
      if (allReactors[1]) {
        displayName = `${allReactors[1].FirstName} ${allReactors[1].LastName}`;
      }
    } else {
      displayName = `${allReactors[0].FirstName} ${allReactors[0].LastName}`;
    }
  }

  return (
    <div className={styles.summary}>
      <div className={styles.icons + (topTypes.length === 0 ? ' ' + styles.iconsEmpty : '')}>
        {topTypes.map((t) => {
          const { icon } = reactionOptions.find((r) => r.type === t)!;
          return (
            <Popover
              key={t}
              content={makeList(t)}
              onOpen={loadReactors}
            >
              <img src={icon} alt={t} />
            </Popover>
          );
        })}
      </div>

      {isSolo ? (
        <span className={styles.text}>
          {user!.FirstName} {user!.LastName}
        </span>
      ) : (
        <Popover content={makeList()} onOpen={loadReactors}>
          <span className={styles.text}>
            {displayName && `${displayName} and ${TotalReactions - 1} others`}
          </span>
        </Popover>
      )}
    </div>
  );
}

export default Reactors;
