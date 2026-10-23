# Project Management System (React + Redux Toolkit + JSON Server)

## Run it
```bash
npm install
npm run server   # terminal 1 -> API on http://localhost:3001
npm run dev      # terminal 2 -> App on http://localhost:5173
```
Demo login: demo@test.com / 123456

## Folder structure
```
src/
  api.js                 API base URL
  main.jsx               App entry (Redux Provider + Router)
  App.jsx                Routes
  app/store.js           Redux store
  features/authSlice.js  login, signup, profile update, logout
  features/taskSlice.js  task CRUD
  features/userSlice.js  list of users (for "assign to")
  components/            Navbar, TaskForm, TaskCard
  pages/                 Login, Signup, Dashboard, Profile
  index.css              Responsive styles
```
