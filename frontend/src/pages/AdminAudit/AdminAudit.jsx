import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AdminAudit.module.css";
import { translations } from "./lang";

function AdminAudit() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations.audit[lang];

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleLang = () => {
    localStorage.setItem("lang", lang === "am" ? "en" : "am");
    window.location.reload();
  };

  // ================= LOAD LOGS =================
  const loadLogs = async () => {
    try {
      const res = await api.get("/reports/audit-logs");
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Audit error:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
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

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t.no}</th>
              <th>{t.user}</th>
              <th>{t.action}</th>
              <th>{t.date}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">{t.loading}</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="4">{t.noData}</td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{log.username}</td>
                  <td className={styles.action}>{log.action}</td>
                  <td>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminAudit;