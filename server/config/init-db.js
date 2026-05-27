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
    )`,
    `CREATE TABLE IF NOT EXISTS takeout_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_no VARCHAR(50) UNIQUE,
      publisher_id INT,
      worker_id INT,
      platform VARCHAR(50),
      pickup_location VARCHAR(100),
      pickup_code VARCHAR(50),
      destination VARCHAR(255),
      publisher_gender VARCHAR(10),
      phone_tail VARCHAR(10),
      delivery_fee DECIMAL(10,2),
      status TINYINT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (publisher_id) REFERENCES users(id),
      FOREIGN KEY (worker_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS express_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_no VARCHAR(50) UNIQUE,
      publisher_id INT,
      worker_id INT,
      express_type VARCHAR(50),
      tracking_no VARCHAR(100),
      package_size VARCHAR(20),
      destination VARCHAR(255),
      phone_tail VARCHAR(10),
      delivery_fee DECIMAL(10,2),
      status TINYINT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (publisher_id) REFERENCES users(id),
      FOREIGN KEY (worker_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS moving_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_no VARCHAR(50) UNIQUE,
      publisher_id INT,
      worker_id INT,
      from_location VARCHAR(255),
      to_location VARCHAR(255),
      luggage_count INT,
      luggage_desc TEXT,
      expect_time VARCHAR(100),
      delivery_fee DECIMAL(10,2),
      status TINYINT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (publisher_id) REFERENCES users(id),
      FOREIGN KEY (worker_id) REFERENCES users(id)
    )`
  ];

  for (const sql of tables) {
    await pool.execute(sql);
  }
  console.log('All tables created successfully');
};

module.exports = createTables;
