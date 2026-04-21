import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import styles from "./SupervisorDashboard.module.css";
import { translations } from "./lang";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);
function SupervisorDashboard() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations[lang];

  const [data, setData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
const [chartType, setChartType] = useState("bar");
  const [daily, setDaily] = useState([]);

  // 🔒 ROLE CHECK
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) navigate("/");
    if (role !== "Supervisor") navigate("/dashboard");
  }, []);

  // 📊 LOAD DATA
const loadDashboard = async () => {
  try {
    const res = await api.get("/reports/summary", {
      withCredentials: true
    });

    // ✅ summary data
    setData({
      total: Number(res.data.total) || 0,
      pending: Number(res.data.pending) || 0,
      approved: Number(res.data.approved) || 0,
      rejected: Number(res.data.rejected) || 0
    });

    // ✅ daily data (comes from SAME API)
    setDaily(res.data.daily || []);

  } catch (err) {
    console.error(err);
    console.log(err.response?.data);
    alert(t.error);
  }
};

  useEffect(() => {
    loadDashboard();
  }, []);

  // 🌍 LANGUAGE
  const toggleLang = () => {
    localStorage.setItem("lang", lang === "am" ? "en" : "am");
    window.location.reload();
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
const chartData = {
  labels: daily.map(d => d.date),
  datasets: [
    {
      label: "Applications",
      data: daily.map(d => d.count)
    }
  ]
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
              <Link to="/applications/submitted">{t.review}</Link>
            </li>

           <li>
  <Link to="/reports">📊 Reports</Link>
</li>
          </ul>
        </aside>

        {/* CONTENT */}
        <main className={styles.content}>

          <h3>{t.status}</h3>

          <button className={styles.refresh} onClick={loadDashboard}>
            {t.refresh}
          </button>

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

       <h3>{lang === "am" ? "ያለፉ 7 ቀናት" : "Last 7 Days"}</h3>

{daily.length === 0 ? (
  <p className={styles.noData}>
    {lang === "am"
      ? "ባለፉ 7 ቀናት መዝገብ የለም"
      : "No records in the last 7 days"}
  </p>
) : (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>{lang === "am" ? "ቀን" : "Date"}</th>
        <th>{lang === "am" ? "ብዛት" : "Count"}</th>
      </tr>
    </thead>

    <tbody>
      {daily.map((d, i) => (
        <tr key={i}>
          <td>{d.date}</td>
          <td>{d.count}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
{/* <h3>{t.chart || "Application Trends"}</h3>

<select
  value={chartType}
  onChange={(e) => setChartType(e.target.value)}
>
  <option value="bar">Bar Chart</option>
  <option value="line">Line Chart</option>
</select>

<div style={{ maxWidth: "600px", marginTop: "20px" }}>
  {chartType === "bar" ? (
    <Bar data={chartData} />
  ) : (
    <Line data={chartData} />
  )}
</div> */}
        </main>
      </div>
    </>
  );
}

export default SupervisorDashboard;