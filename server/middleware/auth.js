const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_service_secret';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ code: 401, message: 'token无效' });
  }
};

module.exports = auth;
