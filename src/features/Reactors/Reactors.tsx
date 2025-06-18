import styles from './Reactors.module.scss';
import { type Post } from '../../types/post';
import { reactionOptions } from '../../constants/reactions';
import type { User } from '../../services/userService';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { getPostReactors, type Reactor } from '../../services/reactionService';
import Popover from './Popover';

const DISPLAY_LIMIT = 6;

interface Props {
  post: Post;
  user: User | null;
}

const Reactors = ({ post, user }: Props) => {
  const {
    TotalReactions,
    LastReactionAuthor,
    Reactions,
    UserReaction,
    AuthorID,
    PostID,
  } = post;

  const [allReactors, setAllReactors] = useState<Reactor[] | null>(null);
  const [loading, setLoading] = useState(false);
  

  const loadReactors = useCallback(async () => {
    if (allReactors || loading) return;
    setLoading(true);
    try {
      setAllReactors(await getPostReactors(PostID));
    } finally {
      setLoading(false);
    }
  }, [allReactors, loading, PostID]);

  useEffect(() => {
    if (!user) return;

    setAllReactors(prev => {
      if (!prev) return prev;

      const meIdx    = prev.findIndex(r => r.UserID === user.UserID);
      const nextType = post.UserReaction;

      let list = meIdx !== -1
        ? prev.filter(r => r.UserID !== user.UserID)
        : prev;

      if (nextType) {
        list = [
          {
            UserID:    user.UserID,
            FirstName: user.FirstName,
            LastName:  user.LastName,
            AvatarUrl: user.AvatarUrl,
            ReactionType: nextType,
          },
          ...list,
        ];
      }

      if (list.length === prev.length &&
          list.every((r, i) => r === prev[i])) {
        return prev;
      }

      return list;
    }); 

  },  [post.UserReaction, user]);


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
      <div className={styles.icons}>
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
