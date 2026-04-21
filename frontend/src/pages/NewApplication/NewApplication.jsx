import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./NewApplication.module.css";
import { translations } from "./lang";

function NewApplication() {
  const navigate = useNavigate();

  const [lang, setLang] = useState("am");

  // NEW i18n function (important change)
  const t = (key) => translations[key][lang];

  const [form, setForm] = useState({
    name: "",
    date_of_birth: "",
    fayida_id: "",
    kebele_id: "",
    address: "",
    marital_status: "single"
  });

  const [files, setFiles] = useState({});
  const [message, setMessage] = useState(null);

  const toggleLang = () => {
    setLang(lang === "am" ? "en" : "am");
  };

  // 🧾 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📂 HANDLE FILE
  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const maxSize = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];

    for (let key in files) {
      const file = files[key];
      if (!file) continue;

      if (file.size > maxSize) {
        return setMessage({ type: "error", text: t("fileSize") });
      }

      if (!allowed.includes(file.type)) {
        return setMessage({ type: "error", text: t("fileType") });
      }
    }

    if (form.fayida_id && !/^[0-9]{12}$/.test(form.fayida_id)) {
      return setMessage({ type: "error", text: t("fayidaError") });
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    Object.keys(files).forEach((key) => {
      if (files[key]) formData.append(key, files[key]);
    });

    try {
      await api.post("/applications", formData);

      setMessage({ type: "success", text: t("success") });

      setForm({
        name: "",
        date_of_birth: "",
        fayida_id: "",
        kebele_id: "",
        address: "",
        marital_status: "single"
      });

      setFiles({});
    }  catch (err) {
  console.log("FULL ERROR:", err);
  console.log("RESPONSE DATA:", err.response?.data);

  const msg = err.response?.data?.message;

  const text =
    typeof msg === "object"
      ? msg[lang]
      : msg || t("error");

  setMessage({
    type: "error",
    text
  });
}

    setTimeout(() => setMessage(null), 3000);
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

      {/* HEADER */}
      <div className={styles.header}>
<button className={styles.backbtn} onClick={goBack}>
            {t("back")}
</button>
        <span onClick={toggleLang} className={styles.lang}>
          {lang === "am" ? "English" : "አማርኛ"}
        </span>
      </div>

      <h2>{t("title")}</h2>

      {/* MESSAGE */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className={styles.form}>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("name")}
          required
        />

        <input
          type="date"
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
          required
        />

        <input
          name="fayida_id"
          value={form.fayida_id}
          onChange={handleChange}
          placeholder={t("fayida")}
        />

        <input
          name="kebele_id"
          value={form.kebele_id}
          onChange={handleChange}
          placeholder={t("kebele")}
          required
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder={t("address")}
          required
        />

        <label>{t("marital")}</label>
<select name="marital_status" onChange={handleChange}>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>

        <h3>{t("upload")}</h3>

        <input type="file" name="signature" onChange={handleFile} />
        <input type="file" name="fayida_doc" onChange={handleFile} />
        <input type="file" name="kebele_doc" onChange={handleFile} />

        <button>{t("submit")}</button>
      </form>
    </div>
  );
}

export default NewApplication;