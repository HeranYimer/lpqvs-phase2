import express from "express";
import {
  getAllApplications,
  getSingleApplication,
  getApplicationDocuments
} from "../../controllers/application/get.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/applications", requireAuth, getAllApplications);
router.get("/applications/:id", requireAuth, getSingleApplication);
router.get("/applications/:id/documents", requireAuth, getApplicationDocuments);
export default router;