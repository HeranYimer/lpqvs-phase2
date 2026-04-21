import fs from "fs";
import path from "path";

export const getStorageUsage = async (req, res) => {
  try {
    const uploadsPath = path.join(process.cwd(), "uploads");

    let totalSize = 0;

    const files = fs.readdirSync(uploadsPath);

    files.forEach(file => {
      const filePath = path.join(uploadsPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        totalSize += stats.size;
      }
    });

    // Convert to MB
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    res.json({
      usage: `${sizeMB} MB`
    });

  } catch (err) {
    console.error("STORAGE ERROR:", err);
    res.status(500).json({ message: "Storage error" });
  }
};