const express = require('express');
const router = express.Router();
const { addBus, getBusesByUser, editBus, deleteBus } = require('../controllers/busController');

router.post('/add', addBus);
router.get('/list',  getBusesByUser);
router.put('/update/:id', editBus);
router.delete('/delete/:id', deleteBus);

module.exports = router;