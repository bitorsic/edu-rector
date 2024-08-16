const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { users, classrooms } = require('../models');

router.post('/', auth, async (req, res) => {
	try {
		if (req.user.type != 0) throw 403; // only principal can create classrooms
		
		const teacher = await users.findById(req.body.teacher, 'type teaches');
		if (!teacher) throw 404;
		if (teacher.teaches || teacher.type != 1) throw 409;

		let classroom = {
			_id: req.body.code,
			name: req.body.name,
			teacher: req.body.teacher,
		}

		// // Create user's entry in database
		// user = await users.create(user);

		// const message = "Successfully registered as " + user._id;
		res.status(201).send("Done");
	} catch (e) {
		let code = 500, message = e.message;
		if (e == 403) { code = e; message = "Action not permitted" }
		if (e == 404) { code = e; message = "Teacher with given email not found" }
		if (e == 409) { code = e; message = "Only teacher can have a single class" }
		if (e.code == 11000) { code = 409; message = "Email already in use" }
		res.status(code).send({message});
	}
});

module.exports = router;