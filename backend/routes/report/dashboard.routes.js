import express from "express";
import { getDashboardStats } from "../../controllers/report/dashboard.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", requireAuth, getDashboardStats);

export default router;