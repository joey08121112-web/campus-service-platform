const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');

router.get('/', merchantController.getMerchants);
router.get('/:id', merchantController.getMerchantById);
router.get('/:id/products', merchantController.getProducts);

module.exports = router;
