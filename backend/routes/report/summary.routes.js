import express from "express";
import { getSummary } from "../../controllers/report/summary.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/summary", requireAuth, getSummary);

export default router;