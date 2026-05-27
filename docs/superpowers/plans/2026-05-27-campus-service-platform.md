# 校园综合服务平台 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建校园综合服务平台 MVP，包含订餐、打印、零食小店三个核心模块

**Architecture:** 前后端分离架构，微信小程序原生前端 + Node.js/Express 后端 + MySQL 数据库

**Tech Stack:** 微信小程序原生、Node.js、Express、MySQL、JWT、Multer

---

## 第一阶段：后端项目搭建

### Task 1: 初始化后端项目

**Files:**
- Create: `server/package.json`
- Create: `server/app.js`
- Create: `server/config/db.js`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "campus-service-server",
  "version": "1.0.0",
  "description": "校园综合服务平台后端",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

- [ ] **Step 2: 创建数据库配置文件**

```javascript
// server/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_service',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
```

- [ ] **Step 3: 创建主入口文件**

```javascript
// server/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

- [ ] **Step 4: 安装依赖并启动测试**

```bash
cd server && npm install && npm run dev
```

---

### Task 2: 创建数据库表结构

**Files:**
- Create: `server/config/init-db.js`

- [ ] **Step 1: 创建数据库初始化脚本**

```javascript
// server/config/init-db.js
const pool = require('./db');

const createTables = async () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      openid VARCHAR(100) UNIQUE,
      name VARCHAR(50),
      phone VARCHAR(20),
      student_id VARCHAR(20),
      dormitory VARCHAR(50),
      room VARCHAR(20),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS merchants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      area VARCHAR(50),
      image VARCHAR(255),
      status TINYINT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      merchant_id INT,
      name VARCHAR(100),
      description TEXT,
      price DECIMAL(10,2),
      image VARCHAR(255),
      category VARCHAR(50),
      stock INT DEFAULT 0,
      status TINYINT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (merchant_id) REFERENCES merchants(id)
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_no VARCHAR(50) UNIQUE,
      user_id INT,
      merchant_id INT,
      total_amount DECIMAL(10,2),
      status TINYINT DEFAULT 0,
      address VARCHAR(255),
      phone VARCHAR(20),
      remark TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (merchant_id) REFERENCES merchants(id)
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      product_id INT,
      product_name VARCHAR(100),
      product_price DECIMAL(10,2),
      quantity INT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`,
    `CREATE TABLE IF NOT EXISTS print_jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      dormitory VARCHAR(50),
      file_path VARCHAR(255),
      file_name VARCHAR(255),
      pages INT,
      color_mode VARCHAR(20),
      duplex TINYINT DEFAULT 0,
      amount DECIMAL(10,2),
      pickup_type VARCHAR(20),
      status TINYINT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS snack_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      dormitory VARCHAR(50),
      name VARCHAR(100),
      description TEXT,
      price DECIMAL(10,2),
      image VARCHAR(255),
      stock INT DEFAULT 0,
      status TINYINT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS snack_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_no VARCHAR(50) UNIQUE,
      user_id INT,
      dormitory VARCHAR(50),
      total_amount DECIMAL(10,2),
      pickup_type VARCHAR(20),
      status TINYINT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS snack_order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      product_id INT,
      product_name VARCHAR(100),
      product_price DECIMAL(10,2),
      quantity INT,
      FOREIGN KEY (order_id) REFERENCES snack_orders(id),
      FOREIGN KEY (product_id) REFERENCES snack_products(id)
    )`
  ];

  for (const sql of tables) {
    await pool.execute(sql);
  }
  console.log('All tables created successfully');
};

module.exports = createTables;
```

- [ ] **Step 2: 在 app.js 中调用初始化**

```javascript
// 在 app.js 中添加
const createTables = require('./config/init-db');
createTables().catch(console.error);
```

---

### Task 3: 实现用户认证中间件

**Files:**
- Create: `server/middleware/auth.js`
- Create: `server/routes/user.js`
- Create: `server/controllers/userController.js`

- [ ] **Step 1: 创建认证中间件**

```javascript
// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_service_secret';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ code: 401, message: 'token无效' });
  }
};

module.exports = auth;
```

- [ ] **Step 2: 创建用户控制器**

```javascript
// server/controllers/userController.js
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
```

- [ ] **Step 3: 创建用户路由**

```javascript
// server/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
```

- [ ] **Step 4: 在 app.js 中挂载路由**

```javascript
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);
```

---

## 第二阶段：订餐模块

### Task 4: 商家和菜品接口

**Files:**
- Create: `server/routes/merchant.js`
- Create: `server/controllers/merchantController.js`

- [ ] **Step 1: 创建商家控制器**

```javascript
// server/controllers/merchantController.js
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
```

- [ ] **Step 2: 创建商家路由**

```javascript
// server/routes/merchant.js
const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');

router.get('/', merchantController.getMerchants);
router.get('/:id', merchantController.getMerchantById);
router.get('/:id/products', merchantController.getProducts);

module.exports = router;
```

---

### Task 5: 订单接口

**Files:**
- Create: `server/routes/order.js`
- Create: `server/controllers/orderController.js`

- [ ] **Step 1: 创建订单控制器**

```javascript
// server/controllers/orderController.js
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
```

- [ ] **Step 2: 创建订单路由**

```javascript
// server/routes/order.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', auth, orderController.updateStatus);
router.post('/:id/pay', auth, orderController.payOrder);

module.exports = router;
```

---

## 第三阶段：打印服务模块

### Task 6: 打印服务接口

**Files:**
- Create: `server/routes/print.js`
- Create: `server/controllers/printController.js`

- [ ] **Step 1: 创建打印控制器**

```javascript
// server/controllers/printController.js
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/print/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

exports.upload = multer({ storage }).single('file');

exports.calculatePrice = (req, res) => {
  const { pages, color_mode, duplex } = req.query;
  let pricePerPage;

  if (color_mode === 'bw' && duplex === '0') pricePerPage = 0.3;
  else if (color_mode === 'bw' && duplex === '1') pricePerPage = 0.5;
  else if (color_mode === 'color' && duplex === '0') pricePerPage = 0.5;
  else pricePerPage = 1.0;

  const amount = pages * pricePerPage;
  res.json({ code: 200, data: { amount, pricePerPage } });
};

exports.createJob = async (req, res) => {
  const { dormitory, pages, color_mode, duplex, pickup_type } = req.body;
  const file_path = req.file.path;
  const file_name = req.file.originalname;

  let pricePerPage;
  if (color_mode === 'bw' && duplex === '0') pricePerPage = 0.3;
  else if (color_mode === 'bw' && duplex === '1') pricePerPage = 0.5;
  else if (color_mode === 'color' && duplex === '0') pricePerPage = 0.5;
  else pricePerPage = 1.0;

  const amount = pages * pricePerPage + (pickup_type === 'delivery' ? 1 : 0);

  try {
    const [result] = await pool.execute(
      'INSERT INTO print_jobs (user_id, dormitory, file_path, file_name, pages, color_mode, duplex, amount, pickup_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, dormitory, file_path, file_name, pages, color_mode, duplex, amount, pickup_type]
    );
    res.json({ code: 200, data: { id: result.insertId, amount } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const [jobs] = await pool.execute(
      'SELECT * FROM print_jobs WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ code: 200, data: jobs });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT * FROM print_jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) {
      return res.status(404).json({ code: 404, message: '任务不存在' });
    }
    res.json({ code: 200, data: jobs[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.execute('UPDATE print_jobs SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ code: 200, message: '状态更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
```

- [ ] **Step 2: 创建打印路由**

```javascript
// server/routes/print.js
const express = require('express');
const router = express.Router();
const printController = require('../controllers/printController');
const auth = require('../middleware/auth');

router.post('/upload', auth, printController.upload, (req, res) => {
  res.json({ code: 200, data: { url: `/uploads/print/${req.file.filename}` } });
});
router.get('/calculate', auth, printController.calculatePrice);
router.post('/jobs', auth, printController.upload, printController.createJob);
router.get('/jobs', auth, printController.getJobs);
router.get('/jobs/:id', auth, printController.getJobById);
router.put('/jobs/:id/status', auth, printController.updateStatus);

module.exports = router;
```

---

## 第四阶段：零食小店模块

### Task 7: 零食小店接口

**Files:**
- Create: `server/routes/snack.js`
- Create: `server/controllers/snackController.js`

- [ ] **Step 1: 创建零食控制器**

```javascript
// server/controllers/snackController.js
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
```

- [ ] **Step 2: 创建零食路由**

```javascript
// server/routes/snack.js
const express = require('express');
const router = express.Router();
const snackController = require('../controllers/snackController');
const auth = require('../middleware/auth');

router.get('/', snackController.getSnacks);
router.get('/:id', snackController.getSnackById);
router.post('/orders', auth, snackController.createOrder);
router.get('/orders', auth, snackController.getOrders);
router.get('/orders/:id', auth, snackController.getOrderById);
router.post('/orders/:id/pay', auth, snackController.payOrder);

module.exports = router;
```

- [ ] **Step 3: 在 app.js 中挂载所有路由**

```javascript
const merchantRoutes = require('./routes/merchant');
const orderRoutes = require('./routes/order');
const printRoutes = require('./routes/print');
const snackRoutes = require('./routes/snack');

app.use('/api/merchants', merchantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/print', printRoutes);
app.use('/api/snacks', snackRoutes);
```

---

## 第五阶段：前端小程序

### Task 8: 初始化小程序项目

**Files:**
- Create: `miniprogram/app.json`
- Create: `miniprogram/app.js`
- Create: `miniprogram/app.wxss`
- Create: `miniprogram/utils/request.js`

- [ ] **Step 1: 创建 app.json**

```json
{
  "pages": [
    "pages/index/index",
    "pages/order/list/list",
    "pages/order/menu/menu",
    "pages/order/cart/cart",
    "pages/print/upload/upload",
    "pages/print/orders/orders",
    "pages/snack/list/list",
    "pages/snack/cart/cart",
    "pages/profile/profile"
  ],
  "window": {
    "navigationBarTitleText": "校园综合服务",
    "navigationBarBackgroundColor": "#4A90D9",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "color": "#999",
    "selectedColor": "#4A90D9",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的",
        "iconPath": "images/user.png",
        "selectedIconPath": "images/user-active.png"
      }
    ]
  }
}
```

- [ ] **Step 2: 创建请求工具函数**

```javascript
// miniprogram/utils/request.js
const BASE_URL = 'http://localhost:3000/api';

const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.data.code === 200) {
          resolve(res.data.data);
        } else {
          wx.showToast({ title: res.data.message, icon: 'none' });
          reject(res.data);
        }
      },
      fail: reject
    });
  });
};

module.exports = { request, BASE_URL };
```

---

### Task 9: 首页实现

**Files:**
- Create: `miniprogram/pages/index/index.wxml`
- Create: `miniprogram/pages/index/index.wxss`
- Create: `miniprogram/pages/index/index.js`
- Create: `miniprogram/pages/index/index.json`

- [ ] **Step 1: 创建首页模板**

```html
<!-- miniprogram/pages/index/index.wxml -->
<view class="container">
  <view class="header">
    <text class="title">校园综合服务</text>
  </view>

  <view class="services">
    <view class="service-item" bindtap="goToOrder">
      <image src="/images/order.png" class="service-icon"></image>
      <text>订餐</text>
    </view>
    <view class="service-item" bindtap="goToPrint">
      <image src="/images/print.png" class="service-icon"></image>
      <text>打印</text>
    </view>
    <view class="service-item" bindtap="goToSnack">
      <image src="/images/snack.png" class="service-icon"></image>
      <text>零食</text>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建首页逻辑**

```javascript
// miniprogram/pages/index/index.js
Page({
  goToOrder() {
    wx.navigateTo({ url: '/pages/order/list/list' });
  },
  goToPrint() {
    wx.navigateTo({ url: '/pages/print/upload/upload' });
  },
  goToSnack() {
    wx.navigateTo({ url: '/pages/snack/list/list' });
  }
});
```

---

### Task 10: 订餐模块页面

**Files:**
- Create: `miniprogram/pages/order/list/list.wxml`
- Create: `miniprogram/pages/order/list/list.js`
- Create: `miniprogram/pages/order/menu/menu.wxml`
- Create: `miniprogram/pages/order/menu/menu.js`

- [ ] **Step 1: 创建商家列表页面**

```html
<!-- miniprogram/pages/order/list/list.wxml -->
<view class="container">
  <view class="tabs">
    <view class="tab {{currentArea === 'all' ? 'active' : ''}}" bindtap="switchArea" data-area="all">全部</view>
    <view class="tab {{currentArea === '一食堂' ? 'active' : ''}}" bindtap="switchArea" data-area="一食堂">一食堂</view>
    <view class="tab {{currentArea === '二食堂' ? 'active' : ''}}" bindtap="switchArea" data-area="二食堂">二食堂</view>
    <view class="tab {{currentArea === '南商业街' ? 'active' : ''}}" bindtap="switchArea" data-area="南商业街">南商业街</view>
    <view class="tab {{currentArea === '北商业街' ? 'active' : ''}}" bindtap="switchArea" data-area="北商业街">北商业街</view>
  </view>

  <view class="merchant-list">
    <view class="merchant-item" wx:for="{{merchants}}" wx:key="id" bindtap="goToMenu" data-id="{{item.id}}">
      <image src="{{item.image || '/images/default-merchant.png'}}" class="merchant-img"></image>
      <view class="merchant-info">
        <text class="merchant-name">{{item.name}}</text>
        <text class="merchant-area">{{item.area}}</text>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建商家列表逻辑**

```javascript
// miniprogram/pages/order/list/list.js
const { request } = require('../../../utils/request');

Page({
  data: {
    merchants: [],
    currentArea: 'all'
  },
  onLoad() {
    this.loadMerchants();
  },
  async loadMerchants() {
    const url = this.data.currentArea === 'all'
      ? '/merchants'
      : `/merchants?area=${this.data.currentArea}`;
    const merchants = await request(url);
    this.setData({ merchants });
  },
  switchArea(e) {
    this.setData({ currentArea: e.currentTarget.dataset.area });
    this.loadMerchants();
  },
  goToMenu(e) {
    wx.navigateTo({
      url: `/pages/order/menu/menu?id=${e.currentTarget.dataset.id}`
    });
  }
});
```

---

## 完成

实施计划包含 **10 个 Task**，覆盖后端搭建、三大模块 API、前端小程序基础页面。每个 Task 包含具体代码实现。

**执行顺序：** Task 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10
