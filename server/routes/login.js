const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { users } = require('../models');

router.post('/', async (req, res) => {
	try {
		const user = await users.findById(req.body.email, 'password type');
		if (!user) throw 400;

		if (await bcrypt.compare(req.body.password, user.password)) {
			// Sign JWT token with LOGIN_KEY stored on server
			const token = jwt.sign({ email: user._id, type: user.type }, process.env.LOGIN_KEY, { expiresIn: "15m" });

			res.status(200).send({ email: user._id, token });
		} else throw 403;
	} catch (e) {
		let code = 500, message = e.message;
		if (e == 400) { code = e, message = "User not found" }
		if (e == 403) { code = e, message = "Incorrect password" }
		res.status(code).send({ message });
	}
});

module.exports = router;