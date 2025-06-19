# Upgaming Technical Assignment

A modern social feed web app built with React, TypeScript, and Vite. Users can create posts, comment, reply, react, and interact with each other.

---

## 🚀 Features
- Create, view, and delete posts
- Comment and reply to comments (supports nested replies)
- React to posts and comments with multiple reaction types
- See top authors and weekly stats in the sidebar
- Custom hooks for clean, maintainable code

---

## 🛠️ Getting Started

### 1. **Clone the repository**
```bash
 git clone https://github.com/ceaiius/upgaming-task.git
 cd upgaming-task
```

### 2. **Install dependencies**
```bash
 npm install
```

### 3. **Set up environment variables**
Create a `.env` file in the root of the project and add the following:

```
VITE_API_URL=<your-backend-api-url>
```
- Replace `<your-backend-api-url>` with the base URL of your backend API (e.g., `http://localhost:5000/api`).

### 4. **Run the app locally**
```bash
 npm run dev
```
- The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## 📦 Project Structure
```
src/
  features/      # Feature-based components (Post, Comment, Sidebar, etc.)
  hooks/         # Custom React hooks for fetching, state, and logic
  services/      # API service functions
  store/         # Zustand stores for global state
  types/         # TypeScript types
  assets/        # Images and static assets
  styles/        # SCSS styles
```

---

## 📝 Notes
- Make sure your backend API is running and accessible at the URL you provide in `.env`.
- For development, you can use mock data or connect to your real backend.
- All environment variables must be prefixed with `VITE_` for Vite to recognize them.

