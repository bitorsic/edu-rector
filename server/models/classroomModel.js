const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
	_id: { type: String, required: true }, // classroom code e.g. CS050
	name: { type: String, required: true },
	teacher: { type: String, required: true }, // teacher's email address
	students: [String], // list of students
	timings: [[Number, Number]], // index 0 to 5 for day (Mon-Sat), [start, end] time in minutes from 0:00
	lectures: [[String, Number, Number]] // Mon-Sat, [subject, start, end]
}, { timestamps: true });

module.exports = mongoose.model('classrooms', classroomSchema);