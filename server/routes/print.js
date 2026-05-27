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
