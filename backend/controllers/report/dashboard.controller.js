import db from "../../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {

    const [apps] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(status='Pending') AS pending,
        SUM(status='Approved') AS approved,
        SUM(status='Rejected') AS rejected
      FROM applications
    `);

    const [users] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [today] = await db.query(
      "SELECT COUNT(*) AS todayEntries FROM applications WHERE DATE(created_at)=CURDATE()"
    );

    res.json({
      ...apps[0],
      totalUsers: users[0].totalUsers,
      todayEntries: today[0].todayEntries
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};