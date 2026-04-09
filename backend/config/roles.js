export const roles = {
  Admin: ["*"],

  Supervisor: [
    "view_dashboard",
    "review_application",
    "approve_application",
    "reject_application",
    "view_reports"
  ],

  Officer: [
    "create_application",
    "update_application",
    "view_own_application"
  ],

  Auditor: [
    "view_reports",
    "view_logs"
  ],

  Viewer: [
    "view_dashboard"
  ]
};