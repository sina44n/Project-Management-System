import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../features/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // After login, go to the tasks page
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <form onSubmit={handleSubmit} className="form auth-box">
      <h2>Log in</h2>
      {error && <p className="error">{error}</p>}

      <label>Email</label>
      <input type="email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <label>Password</label>
      <input type="password" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
      <p className="small">New here? <Link to="/signup">Create an account</Link></p>
      <p className="small muted">Demo: demo@test.com / 123456</p>
    </form>
  );
}
