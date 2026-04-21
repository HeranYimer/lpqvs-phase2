import db from "../../config/db.js";
import { verifyFayidaID } from "../../services/fayida.service.js";

export const createApplication = async (req, res) => {

  try {
    const {
      name,
      fayida_id,
      kebele_id,
      address,
      marital_status,
      date_of_birth
    } = req.body;

    const officerId = req.user.id; // ✅ FROM JWT

    if (!officerId) {
      return res.status(401).json({
        message: {
          am: "እባክዎ ይግቡ (ያልተፈቀደ)",
          en: "Unauthorized"
        }
      });
    }

    // =========================================
    // 🔍 FAYIDA MOCK VERIFICATION
    // =========================================
    if (fayida_id) {

      // 1. format validation
      const isValidFormat = /^[0-9]{12}$/.test(fayida_id);

      if (!isValidFormat) {
        return res.status(400).json({
          message: {
            am: "ትክክለኛ የፋይዳ መታወቂያ ያስገቡ",
            en: "Enter a valid Fayida ID"
          }
        });
      }

      // 2. CALL MOCK SERVICE
      const fayidaResult = await verifyFayidaID(fayida_id);

      // ❌ not found
      if (!fayidaResult.data) {
        return res.status(400).json({
          message: {
            am: "ፋይዳ መለያ አልተገኘም",
            en: "Fayida ID not found"
          }
        });
      }

      // 3. NAME MATCH CHECK
      if (
        fayidaResult.data.fullName &&
        name &&
        fayidaResult.data.fullName.toLowerCase() !== name.toLowerCase()
      ) {
        return res.status(400).json({
          message: {
            am: "የፋይዳ መረጃ ከስም ጋር አይዛመድም",
            en: "Fayida data does not match name"
          }
        });
      }

      // 4. DATE OF BIRTH CHECK (FIXED INSIDE SCOPE)
      if (
        fayidaResult.data.dateOfBirth &&
        date_of_birth &&
        fayidaResult.data.dateOfBirth !== date_of_birth
      ) {
        return res.status(400).json({
          message: {
            am: "የትውልድ ቀን ከፋይዳ መረጃ ጋር አይዛመድም",
            en: "Date of birth does not match Fayida record"
          }
        });
      }
    }

    // =========================
    // CHECK DUPLICATES
    // =========================

    if (fayida_id) {
      const [existing] = await db.query(
        "SELECT * FROM applicants WHERE fayida_id = ?",
        [fayida_id]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          message: {
            am: "ይህ Fayida መለያ ቀድሞ ተመዝግቧል",
            en: "This Fayida ID already exists"
          }
        });
      }
    }

    const [duplicate] = await db.query(
      `SELECT * FROM applicants 
       WHERE name = ? AND kebele_id = ? AND date_of_birth = ?`,
      [name, kebele_id, date_of_birth]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        message: {
          am: "ተመሳሳይ አመልካች አለ",
          en: "Duplicate applicant found"
        }
      });
    }

    // =========================
    // INSERT APPLICANT
    // =========================

    const [result] = await db.query(
      `INSERT INTO applicants 
      (name,fayida_id,kebele_id,address,marital_status,date_of_birth)
      VALUES (?,?,?,?,?,?)`,
      [name, fayida_id, kebele_id, address, marital_status, date_of_birth]
    );

    const applicantId = result.insertId;

    // =========================
    // INSERT APPLICATION
    // =========================

    const [appResult] = await db.query(
      "INSERT INTO applications (applicant_id, status, officer_id) VALUES (?,?,?)",
      [applicantId, "Pending", officerId]
    );

    const applicationId = appResult.insertId;

    // =========================
    // FILE UPLOADS
    // =========================

    const files = req.files;

    if (files) {
      const docs = [];

      if (files.signature) {
        docs.push([applicationId, "signature", files.signature[0].filename]);
      }

      if (files.fayida_doc) {
        docs.push([applicationId, "fayida_id", files.fayida_doc[0].filename]);
      }

      if (files.kebele_doc) {
        docs.push([applicationId, "kebele_id", files.kebele_doc[0].filename]);
      }

      if (docs.length > 0) {
        await db.query(
          "INSERT INTO documents (application_id,doc_type,file_path) VALUES ?",
          [docs]
        );
      }
    }

    // =========================
    // SUCCESS RESPONSE
    // =========================

    res.json({
      message: {
        am: "ማመልከቻ ተመዝግቧል",
        en: "Application submitted successfully"
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: {
        am: "የሰርቨር ስህተት",
        en: "Server error"
      }
    });
  }
};