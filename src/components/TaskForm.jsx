import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, updateTask } from "../features/taskSlice";

// Used for both "Add" and "Edit". If `task` is passed, we are editing.
export default function TaskForm({ task, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users.list);

  const [form, setForm] = useState(
    task || {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      assignedTo: user.id,
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, assignedTo: Number(form.assignedTo) };

    if (task) {
      dispatch(updateTask(data));
    } else {
      dispatch(addTask({ ...data, createdBy: user.id }));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{task ? "Edit task" : "New task"}</h2>

      <label>Title</label>
      <input name="title" value={form.title} onChange={handleChange} required />

      <label>Description</label>
      <textarea name="description" rows="3" value={form.description} onChange={handleChange} />

      <div className="row">
        <div>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div>
          <label>Due date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </div>
        <div>
          <label>Assign to</label>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn">{task ? "Save changes" : "Add task"}</button>
      </div>
    </form>
  );
}
