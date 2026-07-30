const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const supabase = require("./supabaseClient");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ---- Residents ----
app.get("/api/residents", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("residents")
      .select("*")
      .order("name");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/residents", async (req, res) => {
  try {
    const { name, birthdate, room_number, admission_date, emergency_contact, notes } = req.body;
    const { data, error } = await supabase
      .from("residents")
      .insert([{ name, birthdate, room_number, admission_date, emergency_contact, notes }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Services ----
app.get("/api/services", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("name");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Tour Requests ----
app.post("/api/tour-requests", async (req, res) => {
  try {
    const { name, email, phone, preferred_date, message } = req.body;
    const { data, error } = await supabase
      .from("tour_requests")
      .insert([{ name, email, phone, preferred_date, message }])
      .select();
    if (error) throw error;
    res.status(201).json({ success: true, id: data[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- (Optional) Delete resident ----
app.delete("/api/residents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("residents").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});