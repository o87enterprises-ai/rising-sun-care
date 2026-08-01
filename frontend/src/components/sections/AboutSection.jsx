import React from "react";

export default function AboutSection({ isVisible }) {
  return (
    <section
      style={{
        height: '100vh',
        width: '100%',
        scrollSnapAlign: 'start',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        pointerEvents: 'none',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', pointerEvents: 'auto' }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 400,
            letterSpacing: '2px',
            color: '#f5f0eb',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
            marginBottom: '1.5rem',
          }}
        >
          About <span style={{ color: '#f5a623' }}>Rising Sun</span>
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            fontWeight: 300,
            color: 'rgba(245,240,235,0.8)',
            maxWidth: '600px',
            margin: '0 auto',
            letterSpacing: '1px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          We believe that every person deserves dignity, connection, and joy — especially those living with memory loss.
          Our intimate community is designed to feel like home, with compassionate staff who know each resident by name.
        </p>
      </div>
    </section>
  );
}