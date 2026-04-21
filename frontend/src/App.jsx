import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import ChangePassword from "./pages/Profile/ChangePassword";
import OfficerDashboard from "./pages/OfficerDashboard/OfficerDashboard";
import NewApplication from "./pages/NewApplication/NewApplication";
import SubmittedApplications from "./pages/SubmittedApplications/SubmittedApplications";
import ViewApplication from "./pages/ViewApplication/ViewApplication";
import UploadDocuments from "./pages/UploadDocuments/UploadDocuments";
import SupervisorDashboard from "./pages/SupervisorDashboard/SupervisorDashboard";
import Reports from "./pages/Reports/Reports";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics/AdminAnalytics";
import AdminAudit from "./pages/AdminAudit/AdminAudit";
import AdminStorage from "./pages/AdminStorage/AdminStorage";
import AdminSettings from "./pages/AdminSettings/AdminSettings";
import ClerkDashboard from "./pages/ClerkDashboard/ClerkDashboard";
import AuditorDashboard from "./pages/AuditorDashboard/AuditorDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

      <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/new-application" element={<NewApplication />} />
<Route path="/applications/submitted" element={<SubmittedApplications />} />
      <Route path="/view-application/:id" element={<ViewApplication />} />
      <Route path="/upload-documents" element={<UploadDocuments />} />
      <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-analytics" element={<AdminAnalytics />} />
      <Route path="/audit-logs" element={<AdminAudit />} />
      <Route path="/storage" element={<AdminStorage />} />
      <Route path="/admin-settings" element={<AdminSettings />} />
      <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
<Route path="/auditor-dashboard" element={<AuditorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;