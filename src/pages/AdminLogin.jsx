import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
export default function AdminLogin() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            <span className="text-[#ff2d9b]">The</span>
            <span className="text-[#00f5ff]"> Showroom</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Admin Access Only</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-8 space-y-5"
        >
          <div className="text-center mb-2">
            <div className="w-12 h-12 rounded-full bg-[#ff2d9b]/10 border border-[#ff2d9b]/30
                            flex items-center justify-center text-2xl mx-auto mb-3">
              🔒
            </div>
            <h2 className="text-white font-bold text-lg">Admin Login</h2>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theshowroom.com"
              className="w-full bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-xl px-4 py-2.5
                         text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00f5ff] transition"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-xl px-4 py-2.5
                         text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00f5ff] transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#ff2d9b] text-white font-semibold rounded-xl
                       hover:bg-[#e91e8c] transition shadow-[0_0_20px_#ff2d9b40]
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-600 text-xs">
            This area is restricted to authorized administrators only.
          </p>
        </form>
      </div>
    </div>
  );
}