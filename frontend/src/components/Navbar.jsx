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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.6rem 2rem',
        borderRadius: '100px',
        background: 'rgba(11, 10, 8, 0.6)',
        border: '1px solid rgba(245, 166, 35, 0.2)',
        backdropFilter: 'blur(8px)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        gap: '1rem',
        pointerEvents: 'auto',
      }}
    >
      <a href="#home" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
        <img src="/logo.png" alt="Rising Sun logo" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} />
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 400, letterSpacing: '2px', color: '#f5f0eb' }}>
          <span style={{ color: '#f5a623' }}>Rising</span> Sun
        </span>
      </a>

      <ul
        style={{
          display: 'flex',
          gap: '2.5rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {links.map((label, idx) => (
          <li key={idx}>
            <a
              href={`#${label.toLowerCase()}`}
              onClick={(e) => handleClick(e, idx)}
              style={{
                color: activeIndex === idx ? '#f5a623' : 'rgba(245,240,235,0.7)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 300,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#f5a623')}
              onMouseLeave={(e) => {
                if (activeIndex !== idx) e.target.style.color = 'rgba(245,240,235,0.7)';
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className="nav-cta"
        style={{
          background: 'transparent',
          border: '1px solid #f5a623',
          color: '#f5a623',
          padding: '0.5rem 1.8rem',
          borderRadius: '50px',
          fontSize: '0.8rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.3s',
          textTransform: 'uppercase',
          background: 'rgba(245, 166, 35, 0.05)',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f5a623';
          e.target.style.color = '#0b0a08';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(245, 166, 35, 0.05)';
          e.target.style.color = '#f5a623';
        }}
      >
        Schedule Tour
      </button>
    </nav>
  );
}