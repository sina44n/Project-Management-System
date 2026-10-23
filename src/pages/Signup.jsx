import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupUser, clearError } from "../features/authSlice";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(form));
  };

  return (
    <form onSubmit={handleSubmit} className="form auth-box">
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}

      <label>Name</label>
      <input required value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <label>Email</label>
      <input type="email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <label>Password (min 6 characters)</label>
      <input type="password" required minLength="6" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button className="btn" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
      <p className="small">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
