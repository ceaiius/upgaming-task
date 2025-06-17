import { useEffect } from 'react';
import styles from './Feed.module.scss';
import { fetchAllPosts } from '../../services/postService';
import { type Post } from '../../types/post';
import emptyStateImage from '../../assets/clouds.png';
import PostSkeleton from '../Post/PostSkeleton';
import PostCard from '../Post/PostCard';

interface Props {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  loading: boolean;
}

const Feed = ({ posts, setPosts, loading }: Props) => {
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchAllPosts();
        
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
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
        <PostCard key={post.PostID} post={post} onDelete={(postId) => {
          setPosts(posts.filter((p) => p.PostID !== postId));
        }}/>
      ))}
    </div>
  );
};

export default Feed;
