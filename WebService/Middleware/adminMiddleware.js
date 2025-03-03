const adminMiddleware = (req, res, next) => {
    if (!req.user) {
      console.error("No user found in request!");
      return res.status(401).json({ message: "Unauthorized: No token provided!" });
    }
  
    if (req.user.role !== "admin") {
      console.error(`Access Denied! User ${req.user.email} is not admin.`);
      return res.status(403).json({ message: "Forbidden: Admins only!" });
    }
  
    console.log(`Admin access granted: ${req.user.email}`);
    res.status(200).json({ message: "Admin access granted!" ,role:req.user.role})
    next();
  };
  
  module.exports = adminMiddleware;
  