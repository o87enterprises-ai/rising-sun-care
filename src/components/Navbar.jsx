import React from "react";

export default function Navbar({ activeIndex, onNavigate }) {
  const links = ["Home", "About", "Services", "Contact"];

  const handleClick = (e, idx) => {
    e.preventDefault();
    onNavigate(idx);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2.5rem",
        padding: "0.6rem 2rem",
        borderRadius: "100px",
        background: "rgba(11, 10, 8, 0.5)",
        border: "1px solid rgba(201, 169, 110, 0.15)",
        backdropFilter: "blur(12px)",
        whiteSpace: "nowrap",
        flexWrap: "nowrap",
      }}
    >
      {links.map((label, idx) => (
        <a
          key={label}
          href={`#section-${label.toLowerCase()}`}
          onClick={(e) => handleClick(e, idx)}
          style={{
            color: activeIndex === idx ? "#c9a96e" : "rgba(245, 240, 235, 0.7)",
            textDecoration: "none",
            fontSize: "0.8rem",
            fontWeight: 300,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "color 0.3s",
          }}
        >
          {label}
        </a>
      ))}
      <button
        style={{
          background: "#c9a96e",
          color: "#0b0a08",
          border: "none",
          padding: "0.4rem 1.6rem",
          borderRadius: "50px",
          fontSize: "0.7rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.3s",
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Schedule Tour
      </button>
    </nav>
  );
}
