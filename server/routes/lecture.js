const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { users, classrooms } = require('../models');

router.post('/', auth, async (req, res) => {
			
});

module.exports = router;