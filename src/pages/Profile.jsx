import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateProfile, clearError } from "../features/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (!user) {
    return (
      <div className="empty">
        <p>Please <Link to="/login">log in</Link> to see your profile.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    const result = await dispatch(updateProfile({ id: user.id, ...form }));
    if (updateProfile.fulfilled.match(result)) setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="form auth-box">
      <h2>My profile</h2>
      {error && <p className="error">{error}</p>}
      {saved && <p className="success">Profile updated</p>}

      <label>Name</label>
      <input required value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <label>Email</label>
      <input type="email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <label>Password</label>
      <input type="password" required minLength="6" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button className="btn" disabled={loading}>{loading ? "Saving..." : "Save changes"}</button>
    </form>
  );
}
