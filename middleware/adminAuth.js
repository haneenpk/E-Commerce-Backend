const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    console.log("Pathname: ", req.path); // Log the pathname

    if (token) {
      try {
        const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET);

        const adminData = await Admin.findById(decoded.id);

        if (adminData !== null) {
          next();
        } else {
          res.status(401).json({ message: 'Not authorized, invalid token' });
        }
      } catch (verifyError) {
        console.error('JWT Verification Error:', verifyError);
        res.status(401).json({ message: 'Not authorized, invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Token not available' });
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = adminAuth;
