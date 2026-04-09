import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={() => navigate("/change-password")}>
        Change Password
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}