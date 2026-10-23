import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTasks } from "../features/taskSlice";
import { fetchUsers } from "../features/userSlice";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: tasks, loading, error } = useSelector((state) => state.tasks);
  const users = useSelector((state) => state.users.list);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  // Load data when the user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="empty">
        <h2>Welcome to TaskBoard</h2>
        <p>Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to manage your tasks.</p>
      </div>
    );
  }

  // Filter by status and search text
  const visibleTasks = tasks.filter((t) => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const count = (status) => tasks.filter((t) => t.status === status).length;

  const openAdd = () => { setEditingTask(null); setShowForm(true); };
  const openEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingTask(null); };

  const viewedAssignee = viewingTask && users.find((u) => u.id === viewingTask.assignedTo);
  const viewedCreator = viewingTask && users.find((u) => u.id === viewingTask.createdBy);

  return (
    <>
      <div className="header">
        <h1>Tasks</h1>
        <button className="btn" onClick={openAdd}>+ New task</button>
      </div>

      <div className="stats">
        <div className="stat"><b>{count("todo")}</b> To do</div>
        <div className="stat"><b>{count("in-progress")}</b> In progress</div>
        <div className="stat"><b>{count("done")}</b> Done</div>
      </div>

      <div className="toolbar">
        <input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && visibleTasks.length === 0 && (
        <p className="empty">No tasks found. Click "New task" to add one.</p>
      )}

      <div className="grid">
        {visibleTasks.map((task) => (
          <TaskCard key={task.id} task={task} onView={setViewingTask} onEdit={openEdit} />
        ))}
      </div>

      {/* Add / Edit popup */}
      {showForm && (
        <div className="overlay">
          <div className="modal">
            <TaskForm task={editingTask} onClose={closeForm} />
          </div>
        </div>
      )}

      {/* View popup */}
      {viewingTask && (
        <div className="overlay">
          <div className="modal">
            <h2>{viewingTask.title}</h2>
            <p>{viewingTask.description || "No description"}</p>
            <p><b>Status:</b> {viewingTask.status}</p>
            <p><b>Priority:</b> {viewingTask.priority}</p>
            <p><b>Due date:</b> {viewingTask.dueDate || "Not set"}</p>
            <p><b>Assigned to:</b> {viewedAssignee ? viewedAssignee.name : "Unknown"}</p>
            <p><b>Created by:</b> {viewedCreator ? viewedCreator.name : "Unknown"}</p>
            <div className="actions">
              <button className="btn" onClick={() => setViewingTask(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
