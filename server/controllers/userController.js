const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_service_secret';

exports.login = async (req, res) => {
  const { openid } = req.body;
  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE openid = ?', [openid]);
    let user;
    if (users.length === 0) {
      const [result] = await pool.execute('INSERT INTO users (openid) VALUES (?)', [openid]);
      user = { id: result.insertId, openid };
    } else {
      user = users[0];
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ code: 200, data: { token, user } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (users.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    res.json({ code: 200, data: users[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, phone, student_id, dormitory, room } = req.body;
  try {
    await pool.execute(
      'UPDATE users SET name=?, phone=?, student_id=?, dormitory=?, room=? WHERE id=?',
      [name, phone, student_id, dormitory, room, req.userId]
    );
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
