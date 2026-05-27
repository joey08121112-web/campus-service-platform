const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', auth, orderController.updateStatus);
router.post('/:id/pay', auth, orderController.payOrder);

module.exports = router;
