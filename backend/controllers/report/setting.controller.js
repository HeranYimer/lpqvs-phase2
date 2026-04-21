import db from "../../config/db.js";

// ================= GET SETTINGS =================
export const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM system_settings ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.json({
        system_name: "LPQVS",
        system_phase: "Phase I"
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET SETTINGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE SETTINGS =================
export const updateSettings = async (req, res) => {
  try {
    const { system_name, system_phase } = req.body;

    await db.query(
      "INSERT INTO system_settings (system_name, system_phase) VALUES (?, ?)",
      [system_name, system_phase]
    );

    res.json({ message: "Settings updated successfully" });
  } catch (err) {
    console.error("UPDATE SETTINGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};