import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./UploadDocuments.module.css";
import { translations } from "./lang";

function UploadDocuments() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations.uploadDocuments;

  const [form, setForm] = useState({
    appId: ""
  });

  const [files, setFiles] = useState({});
  const [toast, setToast] = useState(null);

  const toggleLang = () => {
    localStorage.setItem("lang", lang === "am" ? "en" : "am");
    window.location.reload();
  };

  // 🔔 TOAST
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // helper for translation
  const getText = (obj) => obj[lang];

  // 📥 INPUT
  const handleChange = (e) => {
    setForm({ ...form, appId: e.target.value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.appId) {
      return showToast(getText(t.toast.noAppId), "error");
    }

    const allowed = ["image/jpeg", "image/png", "application/pdf"];

    for (let key in files) {
      const file = files[key];
      if (file && !allowed.includes(file.type)) {
        return showToast(getText(t.toast.invalidFile), "error");
      }
    }

    const formData = new FormData();

    Object.keys(files).forEach((key) => {
      if (files[key]) formData.append(key, files[key]);
    });

    try {
      await api.post(`/applications/${form.appId}/upload`, formData);

      showToast(getText(t.toast.success), "success");

      setForm({ appId: "" });
      setFiles({});
    } catch (err) {
  const msg = err.response?.data?.message;

  if (msg === "FILE_TOO_LARGE") {
    return showToast(getText(t.toast.fileTooLarge), "error");
  }

  if (msg === "INVALID_FILE_TYPE") {
    return showToast(getText(t.toast.invalidFileType), "error");
  }

  // ✅ ADD THIS
  if (msg === "NO_FILES_SELECTED") {
    return showToast(getText(t.toast.noFileSelected), "error");
  }

  showToast(getText(t.toast.uploadError), "error");
}
  };
const role = (localStorage.getItem("role") || "")
  .toLowerCase()
  .trim();

const routes = {
  officer: "/officer-dashboard",
  clerk: "/clerk-dashboard",
  supervisor: "/supervisor-dashboard",
  admin: "/admin-dashboard",
};
console.log("ROLE FROM STORAGE:", localStorage.getItem("role"));
const goBack = () => {
  navigate(routes[role] || "/");
};
  return (
    <div className={styles.page}>
      {/* TOAST */}
      <div className={styles.toastContainer}>
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            {toast.msg}
          </div>
        )}
      </div>

      {/* HEADER */}
      <div className={styles.header}>
        <button
          className={styles.backbtn}
          onClick={goBack}>
        
          {t.back[lang]}
        </button>
        <span onClick={toggleLang} className={styles.lang}>
          {lang === "am" ? "English" : "አማርኛ"}
        </span>
      </div>

      {/* TITLE */}
      <h2 className={styles.title}>{t.title[lang]}</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>{t.applicationId[lang]}</label>
        <input
          type="number"
          value={form.appId}
          onChange={handleChange}
        />

        <h3>{t.sectionTitle[lang]}</h3>

        <label>{t.signature[lang]}</label>
        <input type="file" name="signature" onChange={handleFile} />

        <label>{t.fayida[lang]}</label>
        <input type="file" name="fayida_doc" onChange={handleFile} />

        <label>{t.kebele[lang]}</label>
        <input type="file" name="kebele_doc" onChange={handleFile} />

        <button type="submit">{t.uploadBtn[lang]}</button>
      </form>
    </div>
  );
}

export default UploadDocuments;