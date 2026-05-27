const pool = require('../config/db');

exports.getSnacks = async (req, res) => {
  const { dormitory } = req.query;
  try {
    let sql = 'SELECT * FROM snack_products WHERE status = 1';
    const params = [];
    if (dormitory) {
      sql += ' AND dormitory = ?';
      params.push(dormitory);
    }
    const [snacks] = await pool.execute(sql, params);
    res.json({ code: 200, data: snacks });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getSnackById = async (req, res) => {
  try {
    const [snacks] = await pool.execute('SELECT * FROM snack_products WHERE id = ?', [req.params.id]);
    if (snacks.length === 0) {
      return res.status(404).json({ code: 404, message: '商品不存在' });
    }
    res.json({ code: 200, data: snacks[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  const { dormitory, items, pickup_type } = req.body;
  const order_no = 'SNK' + Date.now();

  try {
    let total_amount = 0;
    for (const item of items) {
      const [product] = await pool.execute('SELECT * FROM snack_products WHERE id = ?', [item.product_id]);
      if (product.length === 0) {
        return res.status(404).json({ code: 404, message: `商品${item.product_id}不存在` });
      }
      if (product[0].stock < item.quantity) {
        return res.status(400).json({ code: 400, message: `${product[0].name}库存不足` });
      }
      total_amount += product[0].price * item.quantity;
    }

    if (pickup_type === 'delivery') total_amount += 1;

    const [orderResult] = await pool.execute(
      'INSERT INTO snack_orders (order_no, user_id, dormitory, total_amount, pickup_type) VALUES (?, ?, ?, ?, ?)',
      [order_no, req.userId, dormitory, total_amount, pickup_type]
    );

    for (const item of items) {
      const [product] = await pool.execute('SELECT * FROM snack_products WHERE id = ?', [item.product_id]);
      await pool.execute(
        'INSERT INTO snack_order_items (order_id, product_id, product_name, product_price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderResult.insertId, item.product_id, product[0].name, product[0].price, item.quantity]
      );
      await pool.execute(
        'UPDATE snack_products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    res.json({ code: 200, data: { order_no, total_amount } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM snack_orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ code: 200, data: orders });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM snack_orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }

    const [items] = await pool.execute(
      'SELECT * FROM snack_order_items WHERE order_id = ?',
      [req.params.id]
    );

    res.json({ code: 200, data: { ...orders[0], items } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.payOrder = async (req, res) => {
  try {
    await pool.execute('UPDATE snack_orders SET status = 1 WHERE id = ? AND status = 0', [req.params.id]);
    res.json({ code: 200, message: '支付成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
