import { useEffect, useState } from 'react';
import styles from './Feed.module.scss';
import { fetchAllPosts } from '../../services/postService';
import { type Post } from '../../types/post';
import emptyStateImage from '../../assets/clouds.png';
import PostSkeleton from '../Post/PostSkeleton';

const Feed = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.gridOverlay}></div>
        <div className={styles.content}>
          <img src={emptyStateImage} alt="No posts" />
          <p>Nothing here for now, stay tuned for updates!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feed}>
      {posts.map((post) => (
        <div key={post.PostID} className={styles.postCard}>
          <p>{post.Content}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
