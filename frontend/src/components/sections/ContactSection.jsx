import React, { useState } from "react";

export default function ContactSection({ isVisible }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", preferred_date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/tour-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      textAlign: "center", pointerEvents: "none", paddingTop: "6rem",
      opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease"
    }}>
      <div style={{ maxWidth: "800px", padding: "0 2rem", pointerEvents: "auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,6vw,4.5rem)",
          fontWeight: 400, letterSpacing: "3px", marginBottom: "1rem",
          textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>
          Let’s <span style={{ color: "#c9a96e" }}>Connect</span>
        </h2>
        <p style={{ fontSize: "clamp(1rem,1.5vw,1.3rem)", fontWeight: 300,
          color: "rgba(245,240,235,0.9)", maxWidth: "600px", margin: "0 auto 2rem",
          textShadow: "0 2px 20px rgba(0,0,0,0.6)", lineHeight: 1.7 }}>
          Schedule a personal tour, ask questions, or simply learn more. We’re here to help you navigate this journey with compassion and clarity.
        </p>
        {submitted ? (
          <p style={{ color: "#c9a96e", fontSize: "1.2rem" }}>✅ Thank you! We'll be in touch soon.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", margin: "0 auto",
            background: "rgba(11,10,8,0.7)", padding: "2rem", borderRadius: "12px", backdropFilter: "blur(4px)"
          }}>
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required
              style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid rgba(201,169,110,0.3)", background: "rgba(255,255,255,0.1)", color: "#f5f0eb" }} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
              style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid rgba(201,169,110,0.3)", background: "rgba(255,255,255,0.1)", color: "#f5f0eb" }} />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange}
              style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid rgba(201,169,110,0.3)", background: "rgba(255,255,255,0.1)", color: "#f5f0eb" }} />
            <input type="date" name="preferred_date" value={formData.preferred_date} onChange={handleChange}
              style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid rgba(201,169,110,0.3)", background: "rgba(255,255,255,0.1)", color: "#f5f0eb" }} />
            <textarea name="message" placeholder="Message (optional)" value={formData.message} onChange={handleChange} rows="3"
              style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid rgba(201,169,110,0.3)", background: "rgba(255,255,255,0.1)", color: "#f5f0eb" }} />
            <button type="submit" style={{
              background: "#c9a96e", color: "#0b0a08", border: "none", padding: "0.8rem",
              borderRadius: "50px", fontSize: "1rem", fontWeight: 600, cursor: "pointer",
              transition: "transform 0.2s"
            }} onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
               onMouseLeave={(e) => e.target.style.transform = "scale(1)"}>
              Send Request
            </button>
            {error && <p style={{ color: "#e74c3c" }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
