import React from "react";

export default function ServicesSection({ isVisible }) {
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
          Our <span style={{ color: '#f5a623' }}>Services</span>
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
          From 24/7 personalized care to memory‑enhancing activities, we offer a full spectrum of services tailored to
          each resident's needs. Our 3:1 staff‑to‑resident ratio ensures that every moment is met with attention and warmth.
        </p>
      </div>
    </section>
  );
}