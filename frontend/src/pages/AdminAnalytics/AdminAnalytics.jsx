import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AdminAnalytics.module.css";
import { translations } from "./lang";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement
);

function AdminAnalytics() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations.analytics[lang];

  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const toggleLang = () => {
    localStorage.setItem("lang", lang === "am" ? "en" : "am");
    window.location.reload();
  };

  // ================= LOAD 7 DAYS =================
  const loadLast7Days = async () => {
    try {
      const res = await api.get("/reports/daily");
      setData(res.data || []);
    } catch {
      setData([]);
    }
  };

  // ================= FILTER =================
  const filterData = async () => {
    if (!from || !to) return alert(t.selectDates);

    try {
      const res = await api.get(`/reports/filter?from=${from}&to=${to}`);
      setData(res.data || []);
    } catch {
      setData([]);
    }
  };

  // ================= EXPORT CSV =================
  const exportCSV = () => {
    if (data.length === 0) return alert(t.noData);

    let csv = "Date,Applications\n";
    data.forEach(d => {
      csv += `${d.date},${d.count}\n`;
    });

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  // ================= EXPORT PDF =================
  const exportPDF = () => {
    if (data.length === 0) return alert(t.noData);

    const doc = new jsPDF();
    doc.text("Applications Report", 20, 20);

    data.forEach((d, i) => {
      doc.text(`${d.date} - ${d.count}`, 20, 30 + i * 10);
    });

    doc.save("report.pdf");
  };

  // ================= CHART DATA =================
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: t.applications,
        data: data.map(d => d.count)
      }
    ]
  };

  useEffect(() => {
    loadLast7Days();
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

      {/* FILTERS */}
      <div className={styles.filters}>

        <input className={styles.date} type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input className={styles.date} type="date" value={to} onChange={e => setTo(e.target.value)} />

       <select value={chartType} onChange={e => setChartType(e.target.value)}>
  <option value="line">{t.chartTypes.line}</option>
  <option value="bar">{t.chartTypes.bar}</option>
  <option value="pie">{t.chartTypes.pie}</option>
</select>

        <button onClick={filterData}>{t.filter}</button>
        <button onClick={loadLast7Days}>{t.last7}</button>
        <button onClick={exportCSV}>{t.csv}</button>
        <button onClick={exportPDF}>{t.pdf}</button>

      </div>

      {/* CHART */}
      <div className={styles.chart}>
        {chartType === "line" && <Line data={chartData} />}
        {chartType === "bar" && <Bar data={chartData} />}
        {chartType === "pie" && <Pie data={chartData} />}
      </div>

      {/* TABLE */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t.date}</th>
            <th>{t.count}</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="2">{t.noData}</td>
            </tr>
          ) : (
            data.map((d, i) => (
              <tr key={i}>
                <td>{new Date(d.date).toLocaleDateString()}</td>
                <td>{d.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default AdminAnalytics;