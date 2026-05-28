const pool = require('../config/db');

exports.getItems = async (req, res) => {
  const { category } = req.query;
  try {
    let sql = 'SELECT i.*, u.name as seller_name FROM idle_items i LEFT JOIN users u ON i.user_id = u.id WHERE i.status = 1';
    const params = [];
    if (category) { sql += ' AND i.category = ?'; params.push(category); }
    sql += ' ORDER BY i.created_at DESC';
    const [items] = await pool.execute(sql, params);
    res.json({ code: 200, data: items });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getItemById = async (req, res) => {
  try {
    const [items] = await pool.execute(
      'SELECT i.*, u.name as seller_name, u.phone as seller_phone FROM idle_items i LEFT JOIN users u ON i.user_id = u.id WHERE i.id = ?',
      [req.params.id]
    );
    if (items.length === 0) return res.status(404).json({ code: 404, message: '商品不存在' });
    res.json({ code: 200, data: items[0] });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.createItem = async (req, res) => {
  const { title, description, price, images, condition, category } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO idle_items (user_id, title, description, price, images, condition, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, title, description, price, images || '', condition || '', category || '']
    );
    res.json({ code: 200, data: { id: result.insertId } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getMyItems = async (req, res) => {
  try {
    const [items] = await pool.execute('SELECT * FROM idle_items WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    res.json({ code: 200, data: items });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.deleteItem = async (req, res) => {
  try {
    await pool.execute('UPDATE idle_items SET status = 0 WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    res.json({ code: 200, message: '已下架' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};
