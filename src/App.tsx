import "./styles/main.scss";
import Feed from "./features/Feed/Feed";
import Sidebar from "./features/Sidebar/Sidebar";
import CreatePostPreview from "./features/CreatePost/CreatePostPreview";

const App = () => {
  return (
    <div className="app-container">
      <div className="header">
        <h1>Good Morning Nick</h1>
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
