export const permissions = {
  createApplication: ["Officer", "Clerk", "Admin"],
  uploadDocuments: ["Officer", "Clerk", "Admin"],
  performVerification: ["Officer", "Supervisor"],
  makeDecision: ["Supervisor", "Admin"],
  viewApplications: ["Officer", "Clerk", "Supervisor", "Auditor", "Admin"],
  viewDocuments: ["Officer", "Clerk", "Supervisor", "Auditor", "Admin"]
};