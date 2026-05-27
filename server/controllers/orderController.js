const pool = require('../config/db');

exports.createOrder = async (req, res) => {
  const { merchant_id, items, address, phone, remark } = req.body;
  const order_no = 'ORD' + Date.now();

  try {
    const [merchant] = await pool.execute('SELECT * FROM merchants WHERE id = ?', [merchant_id]);
    if (merchant.length === 0) {
      return res.status(404).json({ code: 404, message: '商家不存在' });
    }

    let total_amount = 0;
    for (const item of items) {
      const [product] = await pool.execute('SELECT * FROM products WHERE id = ?', [item.product_id]);
      if (product.length === 0) {
        return res.status(404).json({ code: 404, message: `商品${item.product_id}不存在` });
      }
      total_amount += product[0].price * item.quantity;
    }

    const [orderResult] = await pool.execute(
      'INSERT INTO orders (order_no, user_id, merchant_id, total_amount, address, phone, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [order_no, req.userId, merchant_id, total_amount, address, phone, remark]
    );

    for (const item of items) {
      const [product] = await pool.execute('SELECT * FROM products WHERE id = ?', [item.product_id]);
      await pool.execute(
        'INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderResult.insertId, item.product_id, product[0].name, product[0].price, item.quantity]
      );
    }

    res.json({ code: 200, data: { order_no, total_amount } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, m.name as merchant_name FROM orders o
       LEFT JOIN merchants m ON o.merchant_id = m.id
       WHERE o.id = ?`,
      [req.params.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }

    const [items] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    res.json({ code: 200, data: { ...orders[0], items } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ code: 200, message: '状态更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.payOrder = async (req, res) => {
  try {
    await pool.execute('UPDATE orders SET status = 1 WHERE id = ? AND status = 0', [req.params.id]);
    res.json({ code: 200, message: '支付成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
