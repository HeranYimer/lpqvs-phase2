import db from "../../config/db.js";

export const verifyApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const checks = req.body.checks;

    // ================= VALIDATION =================
    if (!checks || !Array.isArray(checks)) {
      return res.status(400).json({
        message: "Verification data is required"
      });
    }

    // SRS STRICT RULE: MUST BE EXACTLY 4 CHECKS
    if (checks.length !== 4) {
      return res.status(400).json({
        message: "Exactly 4 verification checks required"
      });
    }

    // ================= REQUIRED CHECK TYPES =================
    const requiredChecks = ["Land", "Marital", "Kebele", "Fayida"];

    const receivedChecks = checks.map(c => c.item_name);

    const missing = requiredChecks.filter(
      item => !receivedChecks.includes(item)
    );

    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing checks: ${missing.join(", ")}`
      });
    }

    // ================= REMOVE OLD VERIFICATION =================
    await db.query(
      "DELETE FROM verifications WHERE application_id = ?",
      [applicationId]
    );

    // ================= INSERT NEW VERIFICATION =================
    const values = checks.map(c => [
      applicationId,
      c.item_name,
      c.status === "verified" ? 1 : 0,
      req.user.id,
      new Date(),
      c.comment || null
    ]);

    await db.query(
      `INSERT INTO verifications 
      (application_id, check_type, verified, verified_by, verified_at, comments)
      VALUES ?`,
      [values]
    );

    // ================= ELIGIBILITY RULE (SRS CORE LOGIC) =================

    const allVerified = checks.every(c => c.status === "verified");

    let eligibility = "Not Eligible";

    if (allVerified) {
      eligibility = "Eligible";
    }

    // ================= UPDATE APPLICATION =================
    await db.query(
      "UPDATE applications SET eligibility = ? WHERE id = ?",
      [eligibility, applicationId]
    );

    // ================= RESPONSE =================
    return res.status(200).json({
      message: "Verification completed successfully",
      eligibility
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Verification error"
    });
  }
};