import multer from "multer";
import path from "path";

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // IMPORTANT: use error code so we can handle it in route
    const error = new Error("INVALID_FILE_TYPE");
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

// ================= MULTER CONFIG =================
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export default upload;