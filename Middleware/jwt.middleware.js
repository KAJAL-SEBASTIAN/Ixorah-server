 
const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json('Access Denied. No token provided.');
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = decoded;
    next();
  } catch (err) {
    res.status(400).json('Invalid token.');
  }
};

