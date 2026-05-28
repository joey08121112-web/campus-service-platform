const pool = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE merchant_id = ? ORDER BY created_at DESC',
      [req.merchantId]
    );
    res.json({ code: 200, data: products });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, image, category, stock } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO products (merchant_id, name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.merchantId, name, description, price, image || '', category || '', stock || 0]
    );
    res.json({ code: 200, data: { id: result.insertId } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, image, category, stock, status } = req.body;
  try {
    await pool.execute(
      'UPDATE products SET name=?, description=?, price=?, image=?, category=?, stock=?, status=? WHERE id=? AND merchant_id=?',
      [name, description, price, image || '', category || '', stock || 0, status !== undefined ? status : 1, req.params.id, req.merchantId]
    );
    res.json({ code: 200, message: '更新成功' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    await pool.execute('UPDATE products SET status = 0 WHERE id = ? AND merchant_id = ?', [req.params.id, req.merchantId]);
    res.json({ code: 200, message: '已下架' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.toggleProduct = async (req, res) => {
  try {
    const [product] = await pool.execute('SELECT status FROM products WHERE id = ? AND merchant_id = ?', [req.params.id, req.merchantId]);
    if (product.length === 0) return res.status(404).json({ code: 404, message: '商品不存在' });
    const newStatus = product[0].status === 1 ? 0 : 1;
    await pool.execute('UPDATE products SET status = ? WHERE id = ?', [newStatus, req.params.id]);
    res.json({ code: 200, data: { status: newStatus } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};
