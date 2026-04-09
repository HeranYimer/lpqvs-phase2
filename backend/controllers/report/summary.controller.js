import db from "../../config/db.js";

export const getSummary = async (req, res) => {
  try {

    const summaryQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(status = 'Pending') as pending,
        SUM(status = 'Approved') as approved,
        SUM(status = 'Rejected') as rejected,
        SUM(
          MONTH(created_at) = MONTH(CURDATE()) 
          AND YEAR(created_at) = YEAR(CURDATE())
        ) as monthly
      FROM applications
    `;

    const dailyQuery = `
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM applications
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const [summary] = await db.query(summaryQuery);
    const [daily] = await db.query(dailyQuery);

    res.json({
      ...summary[0],
      daily
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
};