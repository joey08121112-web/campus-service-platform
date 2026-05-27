const pool = require('../config/db');

exports.getMerchants = async (req, res) => {
  const { area } = req.query;
  try {
    let sql = 'SELECT * FROM merchants WHERE status = 1';
    const params = [];
    if (area) {
      sql += ' AND area = ?';
      params.push(area);
    }
    const [merchants] = await pool.execute(sql, params);
    res.json({ code: 200, data: merchants });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getMerchantById = async (req, res) => {
  try {
    const [merchants] = await pool.execute('SELECT * FROM merchants WHERE id = ?', [req.params.id]);
    if (merchants.length === 0) {
      return res.status(404).json({ code: 404, message: '商家不存在' });
    }
    res.json({ code: 200, data: merchants[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE merchant_id = ? AND status = 1',
      [req.params.id]
    );
    res.json({ code: 200, data: products });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [products] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ code: 404, message: '商品不存在' });
    }
    res.json({ code: 200, data: products[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
