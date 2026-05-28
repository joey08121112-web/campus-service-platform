const pool = require('../config/db');

exports.getJobs = async (req, res) => {
  const { job_type } = req.query;
  try {
    let sql = 'SELECT j.*, u.name as publisher_name FROM parttime_jobs j LEFT JOIN users u ON j.publisher_id = u.id WHERE j.status = 1';
    const params = [];
    if (job_type) { sql += ' AND j.job_type = ?'; params.push(job_type); }
    sql += ' ORDER BY j.created_at DESC';
    const [jobs] = await pool.execute(sql, params);
    res.json({ code: 200, data: jobs });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getJobById = async (req, res) => {
  try {
    const [jobs] = await pool.execute(
      'SELECT j.*, u.name as publisher_name FROM parttime_jobs j LEFT JOIN users u ON j.publisher_id = u.id WHERE j.id = ?',
      [req.params.id]
    );
    if (jobs.length === 0) return res.status(404).json({ code: 404, message: '职位不存在' });
    res.json({ code: 200, data: jobs[0] });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.createJob = async (req, res) => {
  const { title, description, job_type, location, salary, salary_type, work_time, headcount } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO parttime_jobs (publisher_id, title, description, job_type, location, salary, salary_type, work_time, headcount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.userId, title, description, job_type || '', location || '', salary || '', salary_type || '', work_time || '', headcount || 1]
    );
    res.json({ code: 200, data: { id: result.insertId } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.applyJob = async (req, res) => {
  try {
    const [existing] = await pool.execute(
      'SELECT * FROM parttime_applications WHERE job_id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (existing.length > 0) return res.status(400).json({ code: 400, message: '已申请过' });
    await pool.execute('INSERT INTO parttime_applications (job_id, user_id) VALUES (?, ?)', [req.params.id, req.userId]);
    res.json({ code: 200, message: '申请成功' });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getMyApplications = async (req, res) => {
  try {
    const [apps] = await pool.execute(
      `SELECT pa.*, j.title, j.salary, j.location
       FROM parttime_applications pa
       LEFT JOIN parttime_jobs j ON pa.job_id = j.id
       WHERE pa.user_id = ? ORDER BY pa.created_at DESC`,
      [req.userId]
    );
    res.json({ code: 200, data: apps });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

exports.getMyJobs = async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT * FROM parttime_jobs WHERE publisher_id = ? ORDER BY created_at DESC', [req.userId]);
    res.json({ code: 200, data: jobs });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};
