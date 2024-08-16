const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { users } = require('../models');

router.post('/', async (req, res) => {
	try {
		// if (req.body.username == "You") throw 409;

		let user = {
			_id: req.body.email,
			password: await bcrypt.hash(req.body.password, 10), // hashed password
			type: 0
		}

		// Create user's entry in database
		user = await users.create(user);

		const message = "Successfully registered as " + user._id;
		res.status(201).send({message});
	} catch (e) {
		let code = 500, message = e.message;
		if (e == 409) { code = e; message = "Please use another username and try again" }
		if (e.code == 11000) { code = 409; message = "Username already in use" }
		res.status(code).send({message});
	}
});

module.exports = router;