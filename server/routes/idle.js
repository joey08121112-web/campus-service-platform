const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/idleController');
const auth = require('../middleware/auth');

router.get('/', ctrl.getItems);
router.get('/my', auth, ctrl.getMyItems);
router.get('/:id', ctrl.getItemById);
router.post('/', auth, ctrl.createItem);
router.delete('/:id', auth, ctrl.deleteItem);

module.exports = router;
