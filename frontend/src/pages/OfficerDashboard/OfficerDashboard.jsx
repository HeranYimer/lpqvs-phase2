import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import styles from "./OfficerDashboard.module.css";
import { labels } from "./lang";

function OfficerDashboard() {
  const navigate = useNavigate();

  const [lang, setLang] = useState("am");
  const t = labels[lang];

  const [data, setData] = useState({
    total: 0,
    pending: 0,
    today: 0,
    monthly: 0
  });

  // 🔒 ROLE CHECK
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) navigate("/");
    if (role !== "Officer") navigate("/");
  }, []);

  // 📊 LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/reports/summary");

        setData({
          total: res.data.total || 0,
          pending: res.data.pending || 0,
          monthly: res.data.monthly || 0,
          today: res.data.today || 0
        });

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    loadData();
  }, []);

  // 🌍 LANGUAGE
  const toggleLang = () => {
    setLang(lang === "am" ? "en" : "am");
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
          <span className={styles.langSwitch} onClick={toggleLang}>
            {lang === "am" ? "English" : "አማርኛ"}
          </span>

          <button onClick={logout}>{t.logout}</button>
        </div>
      </div>

      <div className={styles.container}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <ul>
            <li><Link to="/new-application">{t.newApp}</Link></li>
            <li>
  <Link to="/applications/submitted">{t.myApps}</Link>
</li>
            <li>
  <Link to="/upload-documents">{t.upload}</Link>
</li>
          </ul>
        </aside>

        {/* CONTENT */}
        <main className={styles.content}>
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
              <h4>{t.today}</h4>
              <p>{data.today}</p>
            </div>

            <div className={styles.card}>
              <h4>{t.monthly}</h4>
              <p>{data.monthly}</p>
            </div>

          </div>
        </main>

      </div>
    </>
  );
}

export default OfficerDashboard;