const Bot = require("../models/Bot");
const Delivery = require("../models/Delivery");
const { validationResult } = require('express-validator');
const BotDto = require("../models/DTOs/BotDTO");

exports.createBot = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // create a new bot
        const bot = new Bot(req.body);

        // save the new bot to database
        await bot.save();

        const botDto = new BotDto(bot);

        return res.status(201).json(botDto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.getBots = async (req, res) => {
    try {
        //finding all bots
        const bots = await Bot.find();

        let botsDto = [];

        for (let bot of bots) {
            const botDto = new BotDto(bot);
            botsDto.push(botDto);
        }

        return res.json(botsDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.getBotById = async (req, res) => {
    try {
        //finding current bot
        let bot = await Bot.findOne({ _id: req.params.id });

        if (!bot) {
            return res.status(404).json({ msg: "Bot not found" });
        }

        const botDto = new BotDto(bot);

        return res.json(botDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.patchBot = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // get the variables of bot from body
    const { code, status, location, zone_id, delivery_code } = req.body;

    try {

        // check the id
        let bot = await Bot.findOne({ _id: req.params.id });

        if (!bot) {
            return res.status(404).json({ msg: "Bot not found" });
        }

        if (code) {
            // find the asigned delivery and change the bot_code
            let delivery = await Delivery.findOne({ bot_code: bot.code });
            
            if(delivery) {
                delivery.bot_code = code;
                delivery.save();
            }

            bot.code = code;
        }

        if (status) {
            bot.status = status;
        }

        if (location) {
            bot.location = {
                dropoff_lat: location.dropoff_lat,
                dropoff_lon: location.dropoff_lon
            };
        }

        if (zone_id !== undefined) {
            bot.zone_id = zone_id;
        }

        if (delivery_code !== undefined) {
            bot.delivery_code = delivery_code;
        }

        bot.save();

        const botDto = new BotDto(bot);

        return res.json(botDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}

exports.deleteBot = async (req, res) => {
    try {

        // check the id
        let bot = await Bot.findOne({ _id: req.params.id });

        if (!bot) {
            return res.status(404).json({ msg: "Bot not found" });
        }

        let delivery = await Delivery.findOne({ bot_code: bot.code });

        if (delivery) {
            delivery.state = "pending";
            delivery.bot_code = "";
            delivery.save();
        }

        // update the bot in database
        bot = await Bot.findOneAndRemove({ _id: bot._id });

        return res.json({ msg: "Bot deleted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}

exports.assignDeliveryToBot = async (req, res) => {
    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { delivery_code } = req.body;

    try {
        // check the id
        let bot = await Bot.findOne({ _id: req.params.id });

        if (!bot) {
            return res.status(404).json({ msg: "Bot not found" });
        }

        if (bot.status !== "available") {
            return res.status(400).json({ msg: "Bot must be in Available status" });
        }

        // check the delivery code
        let delivery = await Delivery.findOne({ code: req.body.delivery_code });

        if (!delivery) {
            return res.status(404).json({ msg: "Delivery with this code does not exits" });
        }

        if (delivery.state !== "pending") {
            return res.status(400).json({ msg: "Delivery must be in Pending state" });
        }

        bot.status = "busy";
        bot.location.dropoff_lat = delivery.dropoff.dropoff_lat;
        bot.location.dropoff_lon = delivery.dropoff.dropoff_lon;
        bot.zone_id = delivery.zone_id;
        bot.delivery_code = delivery_code;

        bot.save();

        delivery.state = "assigned";
        delivery.bot_code = bot.code;

        delivery.save();

        const botDto = new BotDto(bot);

        return res.json(botDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}
