import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../api";

// ---------- Async actions ----------

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/users`, { params: { email, password } });
      if (res.data.length === 0) return rejectWithValue("Wrong email or password");
      return res.data[0];
    } catch {
      return rejectWithValue("Cannot reach the server. Is JSON Server running?");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const exists = await axios.get(`${API}/users`, { params: { email } });
      if (exists.data.length > 0) return rejectWithValue("This email is already registered");
      const res = await axios.post(`${API}/users`, { name, email, password });
      return res.data;
    } catch {
      return rejectWithValue("Cannot reach the server. Is JSON Server running?");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ id, ...changes }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API}/users/${id}`, changes);
      return res.data;
    } catch {
      return rejectWithValue("Could not update profile");
    }
  }
);

// ---------- Slice ----------

// Keep the user logged in after page refresh
const savedUser = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: { user: savedUser, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login, signup and profile update all end by saving the user
    [loginUser, signupUser, updateProfile].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
          localStorage.setItem("user", JSON.stringify(action.payload));
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
