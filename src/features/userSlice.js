import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../api";

// All users (used for the "Assign to" dropdown)
export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await axios.get(`${API}/users`);
  return res.data;
});

const userSlice = createSlice({
  name: "users",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default userSlice.reducer;
