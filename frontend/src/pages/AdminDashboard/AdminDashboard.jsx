import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AdminDashboard.module.css";
import { translations } from "./lang";

function AdminDashboard() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations[lang];

  const [data, setData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // 🔒 ROLE CHECK
  useEffect(() => {
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!role) return navigate("/");
    if (role !== "admin") return navigate("/");
  }, []);

  // 📊 LOAD DATA
  useEffect(() => {
    const loadOverview = async () => {
      try {
       const res = await api.get("/reports/admin-overview");

        setData({
          total: res.data.total || 0,
          pending: res.data.pending || 0,
          approved: res.data.approved || 0,
          rejected: res.data.rejected || 0
        });

      } catch (err) {
        console.error("Overview error:", err);
      }
    };

    loadOverview();
  }, []);

  // 🌍 LANGUAGE SWITCH
  const toggleLang = () => {
    localStorage.setItem("lang", lang === "am" ? "en" : "am");
    window.location.reload();
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* HEADER */}
      <div className={styles.header}>
        <h2>{t.title}</h2>

        <div>
          <span className={styles.lang} onClick={toggleLang}>
            {lang === "am" ? "English" : "አማርኛ"}
          </span>

          <button onClick={logout}>{t.logout}</button>
        </div>
      </div>

      <div className={styles.container}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <ul>
            <li>
              <Link to="/applications/submitted">{t.applications}</Link>
            </li>

            <li>
              <Link to="/admin-analytics">{t.dashboard}</Link>
            </li>

            <li>
              <Link to="/audit-logs">{t.logs}</Link>
            </li>

            <li>
              <Link to="/storage">{t.storage}</Link>
            </li>

            <li>
              <Link to="/admin-settings">{t.settings}</Link>
            </li>
          </ul>
        </aside>

        {/* CONTENT */}
        <main className={styles.content}>
          <h3>{t.overview}</h3>

          <div className={styles.cards}>

            <div className={styles.card}>
              <h4>{t.total}</h4>
              <p>{data.total}</p>
            </div>

            <div className={styles.card}>
              <h4>{t.pending}</h4>
              <p>{data.pending}</p>
            </div>

            <div className={styles.card}>
              <h4>{t.approved}</h4>
              <p>{data.approved}</p>
            </div>

            <div className={styles.card}>
              <h4>{t.rejected}</h4>
              <p>{data.rejected}</p>
            </div>

          </div>
        </main>

      </div>
    </>
  );
}

export default AdminDashboard;