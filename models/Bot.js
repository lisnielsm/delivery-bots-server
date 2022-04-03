const mongoose = require('mongoose');

const BotSchema = mongoose.Schema({
	code: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ['available', 'busy', 'reserved'],
		default: 'available'
	},
	location: {
		dropoff_lat: {
			type: String
		},
		dropoff_lon: {
			type: String
		},
	},
	zone_id: {
		type: String,
		trim: true
	},
	delivery_code: {
		type: String
	},
})

module.exports = mongoose.model("Bot", BotSchema);