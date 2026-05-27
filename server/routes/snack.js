const express = require('express');
const router = express.Router();
const snackController = require('../controllers/snackController');
const auth = require('../middleware/auth');

router.get('/', snackController.getSnacks);
router.get('/:id', snackController.getSnackById);
router.post('/orders', auth, snackController.createOrder);
router.get('/orders', auth, snackController.getOrders);
router.get('/orders/:id', auth, snackController.getOrderById);
router.post('/orders/:id/pay', auth, snackController.payOrder);

module.exports = router;
