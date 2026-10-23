import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../api";

// ---------- Async actions (CRUD) ----------

export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const res = await axios.get(`${API}/tasks`);
  return res.data;
});

export const addTask = createAsyncThunk("tasks/add", async (task) => {
  const res = await axios.post(`${API}/tasks`, task);
  return res.data;
});

export const updateTask = createAsyncThunk("tasks/update", async (task) => {
  const res = await axios.put(`${API}/tasks/${task.id}`, task);
  return res.data;
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await axios.delete(`${API}/tasks/${id}`);
  return id;
});

// ---------- Slice ----------

const taskSlice = createSlice({
  name: "tasks",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
        state.error = "Could not load tasks. Is JSON Server running?";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
