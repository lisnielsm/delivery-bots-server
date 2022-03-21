const mongoose = require('mongoose');

const BotSchema = mongoose.Schema({
	creation_date: {
		type: Date
	},
	status: {
		type: String,
		enum: ['available', 'busy', 'reserved'],
		default: 'available'
	},
	location: {
		dropoff_lat: {
			type: Number,
			required: true
		},
		dropoff_lon: {
			type: Number,
			required: true
		},
	},
	zone_id: {
		type: String,
		required: true,
		trim: true
	}
})

module.exports = mongoose.model("Bot", BotSchema);