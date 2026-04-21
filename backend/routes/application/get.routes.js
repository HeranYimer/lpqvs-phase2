import express from "express";
import {
  getAllApplications,
  getSingleApplication,
  getApplicationDocuments
} from "../../controllers/application/get.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
const router = express.Router();

router.get("/applications", requireAuth, 
checkPermission("viewApplications"),
getAllApplications);

router.get("/applications/:id", requireAuth,
checkPermission("viewApplications"),
getSingleApplication);
router.get("/applications/:id/documents", 
requireAuth,
checkPermission("viewDocuments"),
getApplicationDocuments);
export default router;