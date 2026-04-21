import express from "express";
import { verifyFayida } from "../controllers/fayida.controller.js";

const router = express.Router();

router.post("/verify-fayida", verifyFayida);

export default router;