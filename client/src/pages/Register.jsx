import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px py-24 max-w-sm mx-auto">
      <h1 className="heading-serif text-3xl mb-8 text-center">Create your account</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-ink/20 px-4 py-3 text-sm"
          required
        />
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
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/20 px-4 py-3 text-sm"
          required
          minLength={6}
        />
        {error && <p className="text-sm text-wine">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
      <p className="text-sm text-center text-stone mt-6">
        Already have an account? <Link to="/login" className="underline">Sign in</Link>
      </p>
    </div>
  );
}
