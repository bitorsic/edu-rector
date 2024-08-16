const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	password: { type: String, required: true },
	type: { type: Number, required: true },
		// 0 = principal, 1 = teacher, 2 = student
	teaches: { type: String, required: false }, // teacher for class id
	studies: { type: String, required: false }, // student for class id
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);