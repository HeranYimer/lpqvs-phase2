import express from "express";
import upload from "../../config/upload.js";
import { uploadDocuments } from "../../controllers/application/upload.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/role.middleware.js";

const router = express.Router();

const uploadMiddleware = upload.fields([
  { name: "signature", maxCount: 1 },
  { name: "fayida_doc", maxCount: 1 },
  { name: "kebele_doc", maxCount: 1 }
]);

router.post(
  "/applications/:id/upload",
  requireAuth,
  checkRole(["Officer"]),
  (req, res) => {

    uploadMiddleware(req, res, (err) => {

      // 🚨 HANDLE MULTER ERRORS PROPERLY
      if (err) {

  if (err.code === "LIMIT_FILE_SIZE") {
  return res.status(400).json({
    message: "FILE_TOO_LARGE"
  });
}

if (err.code === "INVALID_FILE_TYPE") {
  return res.status(400).json({
    message: "INVALID_FILE_TYPE"
  });
}

        return res.status(400).json({
          message: err.message || "Upload error"
        });
      }

      uploadDocuments(req, res);
    });
  }
);

export default router;