const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productManageController');
const merchantAuth = require('../middleware/merchantAuth');

router.get('/', merchantAuth, ctrl.getProducts);
router.post('/', merchantAuth, ctrl.createProduct);
router.put('/:id', merchantAuth, ctrl.updateProduct);
router.delete('/:id', merchantAuth, ctrl.deleteProduct);
router.post('/:id/toggle', merchantAuth, ctrl.toggleProduct);

module.exports = router;
