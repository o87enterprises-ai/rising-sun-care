import React from "react";

export default function ContactSection({ isVisible }) {
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
          Get in <span style={{ color: '#f5a623' }}>Touch</span>
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            fontWeight: 300,
            color: 'rgba(245,240,235,0.8)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            letterSpacing: '1px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          Schedule a tour or simply reach out to learn more about how we can support your family.
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
          Schedule a Tour
        </button>
      </div>
    </section>
  );
}