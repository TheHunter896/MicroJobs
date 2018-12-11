const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Job = new Schema({
	title: String,
	duration: String,
	location: String,
	salary: String,
	description: String,
	requirements: Array,
	host: { type: Schema.ObjectId, ref: 'User' }
});

var job = mongoose.model('job', Job);

module.exports = job;
