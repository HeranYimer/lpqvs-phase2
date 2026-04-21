import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AdminStorage.module.css";
import { translations } from "./lang";

function AdminStorage() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations.storage[lang];

  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleLang = () => {
    localStorage.setItem("lang", lang === "am" ? "en" : "am");
    window.location.reload();
  };

  // ================= LOAD STORAGE =================
  const loadStorage = async () => {
    try {
      const res = await api.get("/storage-usage");
      setUsage(res.data.usage || "0 MB");
    } catch (err) {
      console.error("Storage error:", err);
      setUsage("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorage();
  }, []);

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/admin-dashboard")}>
          {t.back}
        </button>

        <span onClick={toggleLang} className={styles.lang}>
          {lang === "am" ? "English" : "አማርኛ"}
        </span>
      </div>

      <h2>{t.title}</h2>

      {/* CARD */}
      <div className={styles.card}>
        <h3>{t.status}</h3>

        <p className={styles.value}>
          {loading
            ? t.loading
            : usage === "error"
            ? t.error
            : `${usage} ${t.used}`}
        </p>
      </div>

    </div>
  );
}

export default AdminStorage;