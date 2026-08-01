import React from "react";

export default function HomeSection({ isVisible }) {
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
      <div style={{ maxWidth: '900px', margin: '0 auto', pointerEvents: 'auto' }}>
        <div
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            color: '#f5a623',
            border: '1px solid rgba(245, 166, 35, 0.3)',
            padding: '0.4rem 1.5rem',
            borderRadius: '50px',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(4px)',
            background: 'rgba(0,0,0,0.2)',
            display: 'inline-block',
          }}
        >
          ✦ Premium Memory Care
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 10vw, 6.5rem)',
            fontWeight: 400,
            letterSpacing: '4px',
            lineHeight: 1.1,
            marginBottom: '1rem',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
            color: '#f5f0eb',
          }}
        >
          Where Every <span style={{ color: '#f5a623', fontStyle: 'italic' }}>Moment</span><br />Is Golden
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            fontWeight: 300,
            color: 'rgba(245,240,235,0.8)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            letterSpacing: '1px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          A boutique, home‑like sanctuary in Sacramento. Celebrating small joys with a 3:1 staff‑to‑resident ratio.
        </p>
        <button
          style={{
            background: '#f5a623',
            color: '#0b0a08',
            border: 'none',
            padding: '0.9rem 3rem',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 30px rgba(245,166,35,0.3)',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Discover Our Home
        </button>
      </div>
    </section>
  );
}