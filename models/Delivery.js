// const shortid = require("shortid");

// const DeliveryState = Object.freeze({
//     pending: "pending",
//     assigned: "assigned",
//     in_transit: "in_transit",
//     delivered: "delivered"
// });

// class Delivery {
//     constructor({ pickup, dropoff, zone_id}) {
//         this.id = shortid.generate();
//         this.creation_date = Date.now();
//         this.state = DeliveryState.pending;
//         this.pickup = pickup;
//         this.dropoff = dropoff;
//         this.zone_id = zone_id;
//     }
// }

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