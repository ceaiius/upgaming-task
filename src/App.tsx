import { useEffect, useState } from 'react';
import './styles/main.scss';
import { useStore } from './store';
import { fetchUser } from './services/userService';

import CreatePostPreview from './features/CreatePost/CreatePostPreview';
import Feed from './features/Feed/Feed';
import Sidebar from './features/Sidebar/Sidebar';
import type { Post } from './types/post';

const App = () => {
  const { setUser, user } = useStore();
  const [posts, setPosts] = useState<Post[]>([]);


  const getUser = async () => {
    try {
      const data = await fetchUser();
      setUser(data);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  useEffect(() => {
    getUser();
  }, [setUser]);

  return (
    <div className="app-container">
      <div className="header">
      {user ? (
        <h1>Good Morning {user.FirstName}</h1>
      ) : (
        <h1>Loading user...</h1>
      )}
        <p>Hello! Hope you’re having a fantastic day!</p>
      </div>

      <div className="main-content">
        <section className="feed-section">
          <CreatePostPreview onPostCreated={(newPost: Post) => setPosts((prev) => [newPost, ...prev])} />
          <Feed posts={posts} setPosts={setPosts} />
        </section>

        <aside className="sidebar-section">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
};

export default App;
