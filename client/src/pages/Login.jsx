import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/account");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px py-24 max-w-sm mx-auto">
      <h1 className="heading-serif text-3xl mb-8 text-center">Welcome back</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/20 px-4 py-3 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/20 px-4 py-3 text-sm"
          required
        />
        {error && <p className="text-sm text-wine">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <p className="text-sm text-center text-stone mt-6">
        New here? <Link to="/register" className="underline">Create an account</Link>
      </p>
    </div>
  );
}
