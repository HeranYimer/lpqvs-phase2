import db from "../../config/db.js";

export const makeDecision = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;
    const applicationId = req.params.id;

    const { decision, comment } = req.body;

    // ================= ROLE CHECK =================
    if (role !== "Supervisor") {
      return res.status(403).json({
        message: "አልተፈቀደም"
      });
    }

    // ================= VALIDATION =================
    const allowedDecisions = ["Approved", "Rejected"];

    if (!allowedDecisions.includes(decision)) {
      return res.status(400).json({
        message: "Invalid decision. Use Approved or Rejected"
      });
    }

    // ================= CHECK APPLICATION EXISTS =================
    const [appRows] = await db.query(
      "SELECT * FROM applications WHERE id = ?",
      [applicationId]
    );

    if (appRows.length === 0) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    const application = appRows[0];

    // ================= UPDATE APPLICATION =================
    await db.query(
      `UPDATE applications 
       SET status = ?, 
           decision_date = NOW(), 
           notes = ?
       WHERE id = ?`,
      [decision, comment || null, applicationId]
    );

    // ================= AUDIT LOG (SRS COMPLIANT) =================
    await db.query(
      `INSERT INTO audit_logs (action, user_id, created_at)
       VALUES (?, ?, NOW())`,
      [
        `Supervisor decision: ${decision} (Application ID: ${applicationId})`,
        userId
      ]
    );

    // ================= RESPONSE =================
    return res.status(200).json({
      message: "Decision saved successfully",
      status: decision
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Decision error"
    });
  }
};