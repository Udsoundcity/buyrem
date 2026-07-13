"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res  = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      router.push("/admin/products");
    } else {
      setError("Wrong password. Try again.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">My<em>Shop</em></div>
        <p className="admin-login-sub">Admin Panel — Sign in to manage products</p>

        <form onSubmit={submit}>
          <div className="admin-field">
            <label className="admin-label">Password <span className="admin-req">*</span></label>
            <input
              type="password"
              className="admin-input"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
            {error && (
              <p style={{ color: "#FCA5A5", fontSize: 13, marginTop: 8 }}>⚠️ {error}</p>
            )}
            <p className="admin-input-hint">
              Default password: <strong style={{ color: "#818CF8" }}>admin123</strong>
              &nbsp;— change via <code style={{ color: "#4ADE80" }}>ADMIN_PASSWORD</code> in <code>.env.local</code>
            </p>
          </div>

          <button
            type="submit"
            className="btn-admin-primary"
            style={{ width: "100%", justifyContent: "center", padding: "13px" }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "🔐 Sign In"}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: 16, background: "rgba(99,102,241,0.08)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)" }}>
          <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
            🛡️ This panel is for store owners only. All product changes are saved immediately to <code style={{ color: "#818CF8" }}>data/products.json</code>.
          </p>
        </div>
      </div>
    </div>
  );
}