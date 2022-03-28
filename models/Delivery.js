const mongoose = require('mongoose');

const DeliverySchema = mongoose.Schema({
    creation_date: {
        type: Date
    },
    state: {
        type: String,
        enum: ['pending', 'assigned', 'in_transit', 'delivered'],
        default: 'pending'
    },
    pickup: {
        pickup_lat: {
            type: Number,
            required: true
        },
        pickup_lon: {
            type: Number,
            required: true
        },
    },
    dropoff: {
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

module.exports = mongoose.model("Delivery", DeliverySchema);