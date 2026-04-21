import { permissions } from "../config/permission.js";

export const checkPermission = (action) => {
  return (req, res, next) => {

    const userRole = req.user.role;

    const allowedRoles = permissions[action];

    if (!allowedRoles || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};