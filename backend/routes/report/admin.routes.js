import express from "express";
import {
  getAdminOverview,
  getAuditLogs,
  deleteApplication
} from "../../controllers/report/admin.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/role.middleware.js";
const router = express.Router();

router.get("/reports/admin-overview", requireAuth, checkRole(["Admin"]), getAdminOverview);

router.get("/reports/audit-logs", requireAuth, checkRole(["Admin", "Auditor"]), getAuditLogs);

router.delete("/applications/:id", requireAuth, checkRole(["Admin"]), deleteApplication);
export default router;