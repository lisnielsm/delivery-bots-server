
const Bot = {
	id: "",
	status: "available" | "busy" | "reserved",
	location: {
		dropoff_lat: 0.0,
		dropoff_lon: 0.0,
	},
	zone_id: ""
}

module.exports = Bot;