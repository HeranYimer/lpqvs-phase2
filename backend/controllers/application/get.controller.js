import db from "../../config/db.js";

export const getAllApplications = async (req, res) => {

  const [rows] = await db.query(`
    SELECT applications.id, applicants.name, applications.status, applicants.address
    FROM applications
    JOIN applicants ON applications.applicant_id = applicants.id
  `);

  res.json(rows);
};

export const getSingleApplication = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(`
      SELECT 
        applications.id,
        applications.status,
        applications.eligibility,
        applications.notes,
        applicants.name,
        applicants.address,
        applicants.fayida_id,
        applicants.kebele_id,
        applicants.marital_status
      FROM applications
      JOIN applicants ON applications.applicant_id = applicants.id
      WHERE applications.id = ?
    `, [id]);

    res.json(rows[0]);
  } catch (err) {
    console.error("Single application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getApplicationDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT id, application_id, doc_type, file_path
      FROM documents
      WHERE application_id = ?
    `, [id]);

    res.json(rows);
  } catch (err) {
    console.error("Documents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};