import React, { useEffect, useState } from "react";

export default function ServicesSection({ isVisible }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          Our <span style={{ color: "#c9a96e" }}>Services</span>
        </h2>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {services.map((s) => (
              <li key={s.id} style={{ marginBottom: "0.5rem", fontSize: "1.1rem", color: "rgba(245,240,235,0.9)" }}>
                <strong style={{ color: "#c9a96e" }}>{s.name}</strong> – {s.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
