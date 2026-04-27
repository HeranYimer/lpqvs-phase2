import db from "../../config/db.js";

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const userId = req.user.id;

    const {
      name,
      date_of_birth,
      fayida_id,
      kebele_id,
      address,
      marital_status
    } = req.body;

    // 🔍 Get application
    const [rows] = await db.query(
      "SELECT * FROM applications WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    const app = rows[0];

    // 🔐 ROLE CHECKS
    if (role === "Clerk") {
      if (app.officer_id !== userId) {
        return res.status(403).json({ message: "Not your application" });
      }

      if (app.status !== "Draft") {
        return res.status(403).json({
          message: "Cannot edit after submission"
        });
      }
    }

    if (role === "Officer") {
      if (app.officer_id !== userId) {
        return res.status(403).json({ message: "Not assigned to you" });
      }
    }

    if (role === "Auditor") {
      return res.status(403).json({
        message: "Auditor cannot edit"
      });
    }

    // ✅ UPDATE applicant table
    await db.query(
      `UPDATE applicants 
       SET name=?, date_of_birth=?, fayida_id=?, kebele_id=?, address=?, marital_status=?
       WHERE id=?`,
      [
        name,
        date_of_birth,
        fayida_id,
        kebele_id,
        address,
        marital_status,
        app.applicant_id
      ]
    );

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error("UPDATE ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};