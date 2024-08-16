const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
	_id: { type: String, required: true }, // classroom code e.g. CS050
	name: { type: String, required: true },
	teacher: { type: String, required: true }, // teacher's email address
	students: [String], // list of students
	start: { type: Number, required: true }, // seconds from 0:00
	end: { type: Number, required: true },
	days: [Number] // 0 = Sunday,.. 6 = Saturday
}, { timestamps: true });

module.exports = mongoose.model('classrooms', classroomSchema);