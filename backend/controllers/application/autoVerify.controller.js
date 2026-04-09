// import { verifyFayida } from "../../services/external/fayida.service.js";
// import { checkLandOwnership } from "../../services/external/land.service.js";
// import db from "../../config/db.js";

// export const autoVerifyApplication = async (req, res) => {

//   try {
//     const applicationId = req.params.id;

//     // 1. GET APPLICATION
//     const [rows] = await db.query(
//       `SELECT a.*, ap.fayida_id, ap.address
//        FROM applications a
//        JOIN applicants ap ON a.applicant_id = ap.id
//        WHERE a.id = ?`,
//       [applicationId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     const app = rows[0];

//     // 2. CALL EXTERNAL SYSTEMS
//     const fayida = await verifyFayida(app.fayida_id);
//     const land = await checkLandOwnership(app.fayida_id);

//     // 3. APPLY RULES (SRS)
//     let rules = {
//       noLand: !land.has_land,
//       validFayida: fayida.valid,
//       addressMatch: fayida.address === app.address
//     };

//     let status = "Auto-Rejected";

//     if (rules.noLand && rules.validFayida && rules.addressMatch) {
//       status = "Auto-Approved";
//     }

//     // 4. SAVE RESULT
//     await db.query(
//       `UPDATE applications SET status = ?, auto_verified = 1 WHERE id = ?`,
//       [status, applicationId]
//     );

//     // 5. LOG
//     await db.query(
//       `INSERT INTO audit_logs (action, user_id)
//        VALUES (?, ?)`,
//       [`Auto verification: ${status}`, req.user.id]
//     );

//     res.json({
//       status,
//       rules
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Auto verification failed" });
//   }

// };