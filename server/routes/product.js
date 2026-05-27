const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');

router.get('/:id', merchantController.getProductById);

module.exports = router;
