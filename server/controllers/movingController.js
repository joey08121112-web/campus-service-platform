const pool = require('../config/db');

exports.createOrder = async (req, res) => {
  const { from_location, to_location, luggage_count, luggage_desc, expect_time, delivery_fee } = req.body;
  const order_no = 'MOV' + Date.now();
  try {
    const [result] = await pool.execute(
      'INSERT INTO moving_orders (order_no, publisher_id, from_location, to_location, luggage_count, luggage_desc, expect_time, delivery_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [order_no, req.userId, from_location, to_location, luggage_count, luggage_desc, expect_time, delivery_fee]
    );
    res.json({ code: 200, data: { id: result.insertId, order_no } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getOrders = async (req, res) => {
  const { status } = req.query;
  try {
    let sql = 'SELECT m.*, u.name as publisher_name FROM moving_orders m LEFT JOIN users u ON m.publisher_id = u.id';
    const params = [];
    if (status !== undefined) { sql += ' WHERE m.status = ?'; params.push(status); }
    sql += ' ORDER BY m.created_at DESC';
    const [orders] = await pool.execute(sql, params);
    res.json({ code: 200, data: orders });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM moving_orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ code: 404, message: '订单不存在' });
    res.json({ code: 200, data: orders[0] });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.acceptOrder = async (req, res) => {
  try {
    const [result] = await pool.execute('UPDATE moving_orders SET worker_id = ?, status = 1 WHERE id = ? AND status = 0', [req.userId, req.params.id]);
    if (result.affectedRows === 0) return res.status(400).json({ code: 400, message: '接单失败' });
    res.json({ code: 200, message: '接单成功' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.completeOrder = async (req, res) => {
  try {
    await pool.execute('UPDATE moving_orders SET status = 2 WHERE id = ?', [req.params.id]);
    res.json({ code: 200, message: '已完成' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM moving_orders WHERE publisher_id = ? OR worker_id = ? ORDER BY created_at DESC', [req.userId, req.userId]);
    res.json({ code: 200, data: orders });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};
