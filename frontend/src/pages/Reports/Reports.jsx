import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Reports.module.css";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { translations } from "./lang";

function Reports() {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const lang = localStorage.getItem("lang") || "am";
  const t = translations[lang];

  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");


  const toggleLang = () => {
  localStorage.setItem("lang", lang === "am" ? "en" : "am");
  window.location.reload();
};
  // ================= LOAD =================
  const loadLast7Days = async () => {
    try {
      const res = await api.get("/reports/summary");
      setData(res.data.daily || []);
      renderChart(res.data.daily || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filterData = async () => {
    if (!from || !to) return alert(t.selectDates);

    try {
      const res = await api.get(`/reports/filter?from=${from}&to=${to}`);
      setData(res.data);
      renderChart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CHART =================
  const renderChart = (dataset) => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = dataset.map((d) =>
      new Date(d.date).toLocaleDateString()
    );

    const values = dataset.map((d) => d.count);

    chartInstance.current = new Chart(chartRef.current, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: t.chartLabel,
            data: values,
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  };

  // ================= EXCEL =================
  const exportExcel = () => {
    if (data.length === 0) return alert(t.noData);

    const sheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, sheet, "Report");

    XLSX.writeFile(workbook, "report.xlsx");
  };

  // ================= PDF =================
  const exportPDF = () => {
    if (data.length === 0) return alert(t.noData);

    const doc = new jsPDF();

    doc.text("Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [[t.date, t.count]],
      body: data.map((d) => [
        new Date(d.date).toLocaleDateString(),
        d.count
      ])
    });

    doc.save("report.pdf");
  };

  useEffect(() => {
    loadLast7Days();
  }, []);

  useEffect(() => {
    renderChart(data);
  }, [chartType]);
const goBack = () => {
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (role === "officer") return navigate("/officer-dashboard");
  if (role === "supervisor") return navigate("/supervisor-dashboard");
  if (role === "admin") return navigate("/admin-dashboard");
  if (role === "data entry clerk") return navigate("/clerk-dashboard");
  if (role === "auditor") return navigate("/auditor-dashboard");

  navigate("/");
};
  return (
    <div className={styles.page}>
  
        <button
    className={styles.backBtn}
   onClick={goBack}>
    {t.back}
  </button>
   

  <span onClick={toggleLang} className={styles.lang}>
    {lang === "am" ? "English" : "አማርኛ"}
  </span>
      {/* HEADER */}
      
     <div className={styles.header}>
        <h2>{t.title}</h2>
      </div>

      {/* FILTER CARD */}
   <div className={styles.filters}>

  <div className={styles.field}>
    <label>{t.date}:</label>
    <input
      type="date"
      value={from}
      onChange={(e) => setFrom(e.target.value)}
    />
  </div>

  <div className={styles.field}>
    <label>{t.to || "To"}:</label>
    <input
      type="date"
      value={to}
      onChange={(e) => setTo(e.target.value)}
    />
  </div>

  <div className={styles.field}>
    <select
      value={chartType}
      onChange={(e) => setChartType(e.target.value)}
    >
      <option value="line">{t.line}</option>
      <option value="bar">{t.bar}</option>
      <option value="pie">{t.pie}</option>
    </select>
  </div>

  <button className={styles.filterBtn} onClick={filterData}>{t.filter}</button>

<div className={styles.exportBtns}>

  <button onClick={exportExcel}>
    {t.excel}
  </button>

  <button onClick={exportPDF}>
    {t.pdf}
  </button>
</div>
</div>
{/* EXPORT SECTIOB */}
      {/* CHART */}
      <div className={styles.chartCard}>
        {data.length === 0 ? (
          <p className={styles.last7Days}>{t.last7Days}</p>
        ) : (
          <canvas ref={chartRef}></canvas>
        )}
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <table>
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
        <td data-label={t.date}>
          {new Date(d.date).toLocaleDateString()}
        </td>
        <td data-label={t.count}>
          {d.count}
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

export default Reports;