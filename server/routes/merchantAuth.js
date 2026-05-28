const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/merchantAuthController');
const merchantAuth = require('../middleware/merchantAuth');

router.post('/login', ctrl.login);
router.get('/dashboard', merchantAuth, ctrl.getDashboard);

module.exports = router;
