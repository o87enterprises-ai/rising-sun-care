import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 30,
      display: "flex", justifyContent: "center", alignItems: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)"
    }}>
      <div style={{
        background: "#1a1a1a", padding: "2.5rem", borderRadius: "16px",
        maxWidth: "400px", width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.8)"
      }}>
        <h2 style={{ color: "#c9a96e", fontFamily: "'Playfair Display', serif", marginBottom: "1.5rem" }}>
          Staff Login
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #333", background: "#2a2a2a", color: "#f5f0eb" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #333", background: "#2a2a2a", color: "#f5f0eb" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "0.8rem", background: "#c9a96e", color: "#0b0a08",
              border: "none", borderRadius: "50px", fontWeight: 600, cursor: "pointer"
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          {error && <p style={{ color: "#e74c3c", marginTop: "1rem" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
