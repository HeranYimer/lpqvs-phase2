import db from "../../config/db.js";

export const getFilteredReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "from & to required" });
    }

    const [results] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM applications
       WHERE DATE(created_at) BETWEEN ? AND ?
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [from, to]
    );

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
};