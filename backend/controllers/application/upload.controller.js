import db from "../../config/db.js";

export const uploadDocuments = async (req, res) => {
  try {
    const appId = req.params.id;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        message: "NO_FILES_SELECTED"
      });
    }

    const insertDocs = [];

    // helper function to replace old doc
    const replaceDoc = async (docType, file) => {
      if (!file) return;

      // 1. delete old document of same type
      await db.query(
        "DELETE FROM documents WHERE application_id = ? AND doc_type = ?",
        [appId, docType]
      );

      // 2. add new one
      insertDocs.push([
        appId,
        docType,
        file.filename
      ]);
    };

    // process files
    await replaceDoc("signature", files.signature?.[0]);
    await replaceDoc("fayida_id", files.fayida_doc?.[0]);
    await replaceDoc("kebele_id", files.kebele_doc?.[0]);

    // insert new docs if any
    if (insertDocs.length > 0) {
      await db.query(
        "INSERT INTO documents (application_id, doc_type, file_path) VALUES ?",
        [insertDocs]
      );
    }

    res.json({
     message: "UPLOAD_SUCCESS"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Upload error"
    });
  }
};