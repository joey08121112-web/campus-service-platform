const pool = require('../config/db');

exports.getOrders = async (req, res) => {
  const { status } = req.query;
  try {
    let sql = `SELECT o.*, u.name as user_name, u.phone as user_phone
               FROM orders o LEFT JOIN users u ON o.user_id = u.id
               WHERE o.merchant_id = ?`;
    const params = [req.merchantId];
    if (status !== undefined && status !== '') {
      sql += ' AND o.status = ?';
      params.push(parseInt(status));
    }
    sql += ' ORDER BY o.created_at DESC';
    const [orders] = await pool.execute(sql, params);
    res.json({ code: 200, data: orders });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, u.name as user_name, u.phone as user_phone
       FROM orders o LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND o.merchant_id = ?`,
      [req.params.id, req.merchantId]
    );
    if (orders.length === 0) return res.status(404).json({ code: 404, message: '订单不存在' });
    const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    res.json({ code: 200, data: { ...orders[0], items } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.acceptOrder = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE orders SET status = 2 WHERE id = ? AND merchant_id = ? AND status = 1',
      [req.params.id, req.merchantId]
    );
    if (result.affectedRows === 0) return res.status(400).json({ code: 400, message: '接单失败' });
    res.json({ code: 200, message: '已接单' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.deliverOrder = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE orders SET status = 3 WHERE id = ? AND merchant_id = ? AND status = 2',
      [req.params.id, req.merchantId]
    );
    if (result.affectedRows === 0) return res.status(400).json({ code: 400, message: '操作失败' });
    res.json({ code: 200, message: '已配送' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.completeOrder = async (req, res) => {
  try {
    await pool.execute(
      'UPDATE orders SET status = 4 WHERE id = ? AND merchant_id = ?',
      [req.params.id, req.merchantId]
    );
    res.json({ code: 200, message: '已完成' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};
