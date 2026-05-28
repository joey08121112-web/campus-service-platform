const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/parttimeController');
const auth = require('../middleware/auth');

router.get('/', ctrl.getJobs);
router.get('/my', auth, ctrl.getMyJobs);
router.get('/applications', auth, ctrl.getMyApplications);
router.get('/:id', ctrl.getJobById);
router.post('/', auth, ctrl.createJob);
router.post('/:id/apply', auth, ctrl.applyJob);

module.exports = router;
