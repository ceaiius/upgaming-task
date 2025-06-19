import './styles/main.scss';
import CreatePostPreview from './features/CreatePost/CreatePostPreview';
import Feed from './features/Feed/Feed';
import Sidebar from './features/Sidebar/Sidebar';
import type { Post } from './types/post';
import { useAppData } from './hooks/useAppData';
const App = () => {
  const { posts, setPosts, user, loading } = useAppData();


  return (
    <div className="app-container">
      <div className="header">
      {user ? (
        <h1>Good Morning {user.FirstName}</h1>
      ) : (
        <h1>Loading user...</h1>
      )}
        <p>Hello! Hope you're having a fantastic day!</p>
      </div>

      <div className="main-content">
        <section className="feed-section">
          <CreatePostPreview onPostCreated={(newPost: Post) => setPosts((prev) => [newPost, ...prev])} />
          <Feed posts={posts} setPosts={setPosts} loading={loading} />
        </section>

        <aside className="sidebar-section">
          <Sidebar posts={posts} loading={loading}/>
        </aside>
      </div>
    </div>
  );
};

export default App;
