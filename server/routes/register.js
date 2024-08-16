const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { users } = require('../models');

router.post('/', auth, async (req, res) => {
	try {
		if (req.body.type == 1) { // only principal can register teachers
			if (req.user.type == 0) {} else throw 403;
		} else if (req.body.type == 2) { // only principal and teacher can register students
			console.log(req.user)
			if (req.user.type == 0 || req.user.type == 1) {} else throw 403;
		} else throw 409; // only student and teacher account can be created

		let user = {
			_id: req.body.email,
			password: await bcrypt.hash(req.body.password, 10), // hashed password
			type: req.body.type
		}

		// Create user's entry in database
		user = await users.create(user);

		const message = "Successfully registered as " + user._id;
		res.status(201).send({message});
	} catch (e) {
		let code = 500, message = e.message;
		if (e == 403) { code = e; message = "Action not permitted" }
		if (e == 409) { code = e; message = "Invalid type entered" }
		if (e.code == 11000) { code = 409; message = "Email already in use" }
		res.status(code).send({message});
	}
});

module.exports = router;