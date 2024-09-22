const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/reset', testController.reset);
module.exports = router;
