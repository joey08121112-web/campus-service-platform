const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'campus_service_secret';

const merchantAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ code: 401, message: '未登录' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'merchant') return res.status(403).json({ code: 403, message: '无权限' });
    req.merchantUserId = decoded.merchantUserId;
    req.merchantId = decoded.merchantId;
    next();
  } catch (err) { res.status(401).json({ code: 401, message: 'token无效' }); }
};

module.exports = merchantAuth;
