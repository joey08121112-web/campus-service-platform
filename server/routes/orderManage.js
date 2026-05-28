const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderManageController');
const merchantAuth = require('../middleware/merchantAuth');

router.get('/', merchantAuth, ctrl.getOrders);
router.get('/:id', merchantAuth, ctrl.getOrderDetail);
router.post('/:id/accept', merchantAuth, ctrl.acceptOrder);
router.post('/:id/deliver', merchantAuth, ctrl.deliverOrder);
router.post('/:id/complete', merchantAuth, ctrl.completeOrder);

module.exports = router;
