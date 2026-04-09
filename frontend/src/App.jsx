import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import ChangePassword from "./pages/Profile/ChangePassword";
import OfficerDashboard from "./pages/OfficerDashboard/OfficerDashboard";
import NewApplication from "./pages/NewApplication/NewApplication";
import SubmittedApplications from "./pages/SubmittedApplications/SubmittedApplications";
import ViewApplication from "./pages/ViewApplication/ViewApplication";
import UploadDocuments from "./pages/UploadDocuments/UploadDocuments";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        {/* ✅ ONLY ONE DASHBOARD ROUTE */}
        <Route path="/dashboard" element={<OfficerDashboard />} />

        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/new-application" element={<NewApplication />} />
<Route path="/applications/submitted" element={<SubmittedApplications />} />
      <Route path="/view-application/:id" element={<ViewApplication />} />
      <Route path="/upload-documents" element={<UploadDocuments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;