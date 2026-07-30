import React, { useEffect, useState } from "react";

export default function Dashboard({ user, onLogout }) {
  const [residents, setResidents] = useState([]);
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch residents and tour requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, tourRes] = await Promise.all([
          fetch("http://localhost:5000/api/residents"),
          fetch("http://localhost:5000/api/tour-requests")
        ]);
        const residentsData = await resRes.json();
        const tourData = await tourRes.json();
        setResidents(residentsData);
        setTourRequests(tourData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddResident = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const room = form.room.value;
    const body = { name, room_number: room };
    try {
      const res = await fetch("http://localhost:5000/api/residents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResidents([...residents, data]);
      form.reset();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: "#f5f0eb", padding: "2rem" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: "2rem", color: "#f5f0eb", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#c9a96e" }}>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: "1rem" }}>👤 {user.email}</span>
          <button onClick={onLogout} style={{ background: "#c9a96e", color: "#0b0a08", border: "none", padding: "0.5rem 1.5rem", borderRadius: "50px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Residents */}
        <div>
          <h2>Residents</h2>
          <ul>
            {residents.map(r => (
              <li key={r.id}>{r.name} – Room {r.room_number || "N/A"}</li>
            ))}
          </ul>
          <form onSubmit={handleAddResident} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <input name="name" placeholder="Name" required style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #333", background: "#2a2a2a", color: "#f5f0eb" }} />
            <input name="room" placeholder="Room" style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #333", background: "#2a2a2a", color: "#f5f0eb" }} />
            <button type="submit" style={{ background: "#c9a96e", color: "#0b0a08", border: "none", padding: "0.5rem 1rem", borderRadius: "50px", cursor: "pointer" }}>Add</button>
          </form>
        </div>

        {/* Tour Requests */}
        <div>
          <h2>Tour Requests</h2>
          {tourRequests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <ul>
              {tourRequests.map(t => (
                <li key={t.id}>
                  <strong>{t.name}</strong> – {t.email} ({t.phone})<br />
                  Preferred: {t.preferred_date || "any"}<br />
                  <span style={{ fontSize: "0.9rem", color: "#aaa" }}>{t.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
