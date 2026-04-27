import db from "../../config/db.js";

// ==========================
// GET ALL APPLICATIONS
// ==========================
export const getAllApplications = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let query = `
      SELECT 
        applications.id, 
        applicants.name, 
        applications.status, 
        applicants.address
      FROM applications
      JOIN applicants ON applications.applicant_id = applicants.id
    `;

    let params = [];

    // 🟢 Clerk → ONLY OWN
    if (role === "Clerk") {
      query += " WHERE applications.officer_id = ?";
      params = [userId];
    }

    // 🟢 Officer → ONLY OWN (assigned)
    else if (role === "Officer") {
      query += " WHERE applications.officer_id = ?";
      params = [userId];
    }

    // 🟢 Auditor → ALL (read-only, no filter)

    // 🟢 Supervisor/Admin → ALL (no filter)

    const [rows] = await db.query(query, params);

    res.json(rows);

  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==========================
// GET SINGLE APPLICATION
// ==========================
export const getSingleApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.user.role;
    const userId = req.user.id;

    let query = `
      SELECT 
        applications.id,
        applications.status,
        applications.eligibility,
        applications.notes,
        applications.officer_id,
        applicants.name,
        applicants.date_of_birth,
        applicants.address,
        applicants.fayida_id,
        applicants.kebele_id,
        applicants.marital_status
      FROM applications
      JOIN applicants ON applications.applicant_id = applicants.id
      WHERE applications.id = ?
    `;

    let params = [id];

    // 🟢 Clerk / Officer → can only access own
    if (role === "Clerk" || role === "Officer") {
      query += " AND applications.officer_id = ?";
      params.push(userId);
    }

    const [rows] = await db.query(query, params);

    if (!rows.length) {
      return res.status(403).json({
        message: "Access denied or not found"
      });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("Single application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==========================
// GET DOCUMENTS
// ==========================
export const getApplicationDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const userId = req.user.id;

    // 🔍 First check ownership if needed
    if (role === "Clerk" || role === "Officer") {
      const [check] = await db.query(
        "SELECT officer_id FROM applications WHERE id = ?",
        [id]
      );

      if (!check.length || check[0].officer_id !== userId) {
        return res.status(403).json({
          message: "Access denied"
        });
      }
    }

    const [rows] = await db.query(
      `
      SELECT id, application_id, doc_type, file_path
      FROM documents
      WHERE application_id = ?
      `,
      [id]
    );

    res.json(rows);

  } catch (err) {
    console.error("Documents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};