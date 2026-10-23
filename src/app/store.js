import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import taskReducer from "../features/taskSlice";
import userReducer from "../features/userSlice";

// One global store: auth + tasks + users
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    users: userReducer,
  },
});
