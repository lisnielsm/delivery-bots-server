const Delivery = require("../models/Delivery");
const Bot = require("../models/Bot");
const { validationResult } = require('express-validator');
const DeliveryDto = require("../models/DTOs/DeliveryDTO");

exports.createDelivery = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // create a new delivery
        const delivery = new Delivery(req.body);

        // save the new delivery to database
        delivery.creation_date = Date.now();

        await delivery.save();

        const deliveryDto = new DeliveryDto(delivery);

        return res.status(201).json(deliveryDto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.getDeliveries = async (req, res) => {
    try {
        //finding all deliveries
        const deliveries = await Delivery.find();

        let deliveriesDto = [];

        for (let delivery of deliveries) {
            const deliveryDto = new DeliveryDto(delivery);
            deliveriesDto.push(deliveryDto);
        }

        return res.json(deliveriesDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.getDeliveryById = async (req, res) => {
    try {
        //finding current delivery
        let delivery = await Delivery.findOne({ _id: req.params.id });

        if (!delivery) {
            return res.status(404).json({ msg: "Delivery not found" });
        }

        const deliveryDto = new DeliveryDto(delivery);

        return res.json(deliveryDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.patchDelivery = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // get the variables of delivery from body
    const { state, code, pickup, dropoff, zone_id } = req.body;

    try {

        // check the id
        let delivery = await Delivery.findOne({ _id: req.params.id });

        if (!delivery) {
            return res.status(404).json({ msg: "Delivery not found" });
        }

        if (state) {
            delivery.state = state;
        }

        if (code) {
            let bot = await Bot.findOne({ delivery_code: delivery.code });

            if(bot) {
                bot.delivery_code = code;
                bot.save();
            }
            
            delivery.code = code;
        }
        
        if (pickup) {
            delivery.pickup = {
                pickup_lat: pickup.pickup_lat,
                pickup_lon: pickup.pickup_lon
            };
        }

        if (dropoff) {
            delivery.dropoff = {
                dropoff_lat: dropoff.dropoff_lat,
                dropoff_lon: dropoff.dropoff_lon
            };
        }

        if (zone_id) {
            delivery.zone_id = zone_id;
        }

        if (state === "delivered" || state === "pending") {
            let bot = await Bot.findOne({code: delivery.bot_code});

            if(bot) {
                bot.status = "available";
                bot.location.dropoff_lat = "";
                bot.location.dropoff_lon = "";
                bot.zone_id = "";
                bot.delivery_code = "";
                bot.save();
            }
            
            delivery.bot_code = "";
        }

        delivery.save();

        const deliveryDto = new DeliveryDto(delivery);

        return res.json(deliveryDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}

exports.deleteDelivery = async (req, res) => {
    try {

        // check the id
        let delivery = await Delivery.findOne({ _id: req.params.id });

        if (!delivery) {
            return res.status(404).json({ msg: "Delivery not found" });
        }

        let bot = await Bot.findOne({ code: delivery.bot_code });

        if (bot) {
            bot.status = "available";
            bot.location.dropoff_lat = "";
            bot.location.dropoff_lon = "";
            bot.zone_id = "";
            bot.delivery_code = "";
            bot.save();
        }

        // update the delivery in database
        delivery = await Delivery.findOneAndRemove({ _id: delivery._id });

        return res.json({ msg: "Delivery deleted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}
