const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/expressController');
const auth = require('../middleware/auth');

router.post('/', auth, ctrl.createOrder);
router.get('/', auth, ctrl.getOrders);
router.get('/my', auth, ctrl.getMyOrders);
router.get('/calculate', ctrl.calculatePrice);
router.get('/:id', auth, ctrl.getOrderById);
router.post('/:id/accept', auth, ctrl.acceptOrder);
router.post('/:id/complete', auth, ctrl.completeOrder);

module.exports = router;
