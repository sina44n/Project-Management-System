import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../features/taskSlice";

export default function TaskCard({ task, onView, onEdit }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list);
  const assignee = users.find((u) => u.id === task.assignedTo);

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) dispatch(deleteTask(task.id));
  };

  return (
    <div className="card">
      <div className="card-top">
        <span className={`tag status-${task.status}`}>{task.status}</span>
        <span className={`tag priority-${task.priority}`}>{task.priority}</span>
      </div>

      <h3>{task.title}</h3>
      <p className="muted">{task.description || "No description"}</p>
      <p className="small">
        Assigned to: <b>{assignee ? assignee.name : "Unknown"}</b>
        {task.dueDate && <> &nbsp;|&nbsp; Due: {task.dueDate}</>}
      </p>

      <div className="actions">
        <button className="btn btn-light" onClick={() => onView(task)}>View</button>
        <button className="btn btn-light" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
