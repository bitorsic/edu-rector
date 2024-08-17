const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { users, classrooms } = require('../models');

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

router.put('/:email', auth, async (req, res) => {
	try {
		if (req.user.type == 0 || req.user.type == 1) {} else throw 403;

		const user = await users.findById(req.params.email, 'type studies');

		if (!user) throw 404;
		if (user.type != 2 || user.studies) throw 409;
		
		const classroom = await classrooms.findById(req.body.code, 'students');

		if (!classroom) throw 404;
		if (req.user.type == 1 && classroom.teacher != req.user.email) throw 403; 
			// teacher can add students only to their classroom

		user.studies = classroom._id; await user.save();
		classroom.students.push(user._id); await classroom.save();

		const message = user._id + " added to the classroom " + classroom._id + " successfully";
		res.status(200).send({ message });
	} catch (e) {
		let code = 500, message = e.message;
		if (e == 403) { code = e; message = "Action not permitted" }
		if (e == 404) { code = e; message = "Invalid email address or classroom code" }
		if (e == 409) { code = e; message = "User is not a student or already in a classroom" }
		if (e.code == 11000) { code = 409; message = "Email already in use" }
		res.status(code).send({message});
	}
});

module.exports = router;