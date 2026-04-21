import db from "../../config/db.js";

// ================= ADMIN OVERVIEW =================
export const getAdminOverview = async (req, res) => {
  try {

    const [result] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(status='Pending') AS pending,
        SUM(status='Approved') AS approved,
        SUM(status='Rejected') AS rejected
      FROM applications
    `);

    res.json(result[0]);

  } catch (err) {
    console.error("ADMIN OVERVIEW ERROR:", err);
    res.status(500).json({ message: "DB error" });
  }
};


// ================= AUDIT LOGS =================
export const getAuditLogs = async (req, res) => {
  try {

    const [results] = await db.query(`
      SELECT audit_logs.id, users.username, audit_logs.action, audit_logs.created_at
      FROM audit_logs
      JOIN users ON audit_logs.user_id = users.id
      ORDER BY audit_logs.created_at DESC
    `);

    res.json(results);

  } catch (err) {
    console.error("AUDIT LOG ERROR:", err);
    res.status(500).json({ message: "DB error" });
  }
};


// ================= DELETE APPLICATION =================
export const deleteApplication = async (req, res) => {

  try {

    const applicationId = req.params.id;
    const userId = req.user.id;

    // 🔍 GET APPLICATION
    const [result] = await db.query(
      "SELECT applicant_id, created_at FROM applications WHERE id = ?",
      [applicationId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const createdAt = new Date(result[0].created_at);
    const now = new Date();

    const diffYears = (now - createdAt) / (1000 * 60 * 60 * 24 * 365);

    // 🚨 RULE: MUST BE > 10 YEARS
    if (diffYears < 10) {
      // return res.status(403).json({
      //   message: "This application is not older than 10 years"
      // });
      return res.status(403).json({
  code: "UNDER_10_YEARS"
});
    }

    const applicantId = result[0].applicant_id;

    // 🔥 DELETE ORDER (IMPORTANT)
    await db.query("DELETE FROM documents WHERE application_id = ?", [applicationId]);
    await db.query("DELETE FROM verifications WHERE application_id = ?", [applicationId]);
    await db.query("DELETE FROM applicants WHERE id = ?", [applicantId]);
    await db.query("DELETE FROM applications WHERE id = ?", [applicationId]);

    // 🧾 AUDIT LOG
    await db.query(
      "INSERT INTO audit_logs (action, user_id) VALUES (?, ?)",
      [`Deleted application ID ${applicationId}`, userId]
    );

    res.json({
      message: "Application deleted successfully"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};