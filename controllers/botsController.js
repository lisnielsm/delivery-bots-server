const Bot = require("../models/Bot");
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
    const { status, location, zone_id } = req.body;

    try {

        // check the id
        let bot = await Bot.findOne({ _id: req.params.id });

        if (!bot) {
            return res.status(404).json({ msg: "Bot not found" });
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

        if (zone_id) {
            bot.zone_id = zone_id;
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

        // update the bot in database
        bot = await Bot.findOneAndRemove({ _id: bot._id });

        return res.json({ msg: "Bot deleted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}
