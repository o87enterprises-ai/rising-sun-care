import React from "react";

export default function AboutSection({ isVisible }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        pointerEvents: "none",
        paddingTop: "6rem",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div style={{ maxWidth: "800px", padding: "0 2rem" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 400,
            letterSpacing: "3px",
            marginBottom: "1rem",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          Our <span style={{ color: "#c9a96e" }}>Promise</span>
        </h2>
        <p
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
            fontWeight: 300,
            color: "rgba(245,240,235,0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            lineHeight: 1.7,
          }}
        >
          We believe every moment holds golden light. Our philosophy celebrates small joys,
          preserves dignity, and creates a warm, home‑like sanctuary for those living with memory loss.
        </p>
      </div>
    </div>
  );
}
