import { useEffect } from 'react';
import './styles/main.scss';
import { useStore } from './store';
import { fetchUser } from './services/userService';

import CreatePostPreview from './features/CreatePost/CreatePostPreview';
import Feed from './features/Feed/Feed';
import Sidebar from './features/Sidebar/Sidebar';

const App = () => {
  const { setUser, user } = useStore();

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
          <CreatePostPreview />
          <Feed />
        </section>

        <aside className="sidebar-section">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
};

export default App;
