const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'campus_service_secret';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.execute(
      'SELECT mu.*, m.name as merchant_name, m.area FROM merchant_users mu LEFT JOIN merchants m ON mu.merchant_id = m.id WHERE mu.username = ? AND mu.password = ?',
      [username, password]
    );
    if (users.length === 0) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
    const user = users[0];
    const token = jwt.sign({ merchantUserId: user.id, merchantId: user.merchant_id, role: 'merchant' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ code: 200, data: { token, merchant: { id: user.merchant_id, name: user.merchant_name, area: user.area } } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getDashboard = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const [todayOrders] = await pool.execute(
      'SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount FROM orders WHERE merchant_id = ? AND DATE(created_at) = CURDATE()',
      [merchantId]
    );
    const [totalOrders] = await pool.execute(
      'SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as amount FROM orders WHERE merchant_id = ?',
      [merchantId]
    );
    const [pendingOrders] = await pool.execute(
      'SELECT COUNT(*) as count FROM orders WHERE merchant_id = ? AND status = 1',
      [merchantId]
    );
    const [products] = await pool.execute(
      'SELECT COUNT(*) as count FROM products WHERE merchant_id = ? AND status = 1',
      [merchantId]
    );
    res.json({
      code: 200,
      data: {
        today: { count: todayOrders[0].count, amount: todayOrders[0].amount },
        total: { count: totalOrders[0].count, amount: totalOrders[0].amount },
        pendingOrders: pendingOrders[0].count,
        activeProducts: products[0].count
      }
    });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};
