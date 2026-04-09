import express from "express";
import { getFilteredReport } from "../../controllers/report/filter.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/filter", requireAuth, getFilteredReport);

export default router;