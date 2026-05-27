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
