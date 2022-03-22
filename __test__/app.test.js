process.env.NODE_ENV = "test";

const app = require('../app');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);
const Delivery = require("../models/Delivery");
const Bot = require("../models/Bot");

const databaseName = "deliveries_test";

beforeAll(async () => {
    const url = `mongodb://localhost:27017/${databaseName}`;
    await mongoose.connect(url, {
        useNewUrlParser: true
    });
});

afterEach(async () => {
    await Delivery.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Testing MongoDB database", () => {

    test("Should save a new delivery", async () => {
        const delivery = await Delivery.create({
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        // search the new delivery in database
        const deliveryFetched = await Delivery.findOne({ _id: delivery._id });

        expect(deliveryFetched.creation_date).toStrictEqual(delivery.creation_date);
        expect(deliveryFetched.state).toBe(delivery.state);
        expect(deliveryFetched.pickup.pickup_lat).toBe(delivery.pickup.pickup_lat);
        expect(deliveryFetched.pickup.pickup_lon).toBe(delivery.pickup.pickup_lon);
        expect(deliveryFetched.zone_id).toBe(delivery.zone_id);
    })

    test("Should update a created delivery", async () => {

        const delivery = await Delivery.create({
            creation_date: Date("2022-03-21T19:24:00"),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        // update of the fields of delivery
        delivery.state = "in_transit";
        delivery.pickup.pickup_lat = 24.50;
        delivery.pickup.pickup_lon = 80.50;
        delivery.dropoff.dropoff_lat = 24.60;
        delivery.dropoff.dropoff_lon = 80.60;
        delivery.zone_id = "Cerro";

        await delivery.save();

        expect(delivery.state).toBe("in_transit");
        expect(delivery.pickup.pickup_lat).toBe(24.50);
        expect(delivery.pickup.pickup_lon).toBe(80.50);
        expect(delivery.dropoff.dropoff_lat).toBe(24.60);
        expect(delivery.dropoff.dropoff_lon).toBe(80.60);
        expect(delivery.zone_id).toBe("Cerro");
    })

    test("Should delete a created delivery", async () => {

        const delivery = await Delivery.create({
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        await Delivery.findByIdAndDelete({ _id: delivery._id });

        const deliveryDeleted = await Delivery.findById(delivery._id);

        expect(deliveryDeleted).toEqual(null);
    })
})

describe("Testing connection to API endpoint /deliveries", () => {

    test("GET deliveries list /deliveries", async () => {

        const delivery = await Delivery.create({
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        const delivery2 = await Delivery.create({
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 25.00,
                pickup_lon: 81.00
            },
            dropoff: {
                dropoff_lat: 25.10,
                dropoff_lon: 81.10
            },
            zone_id: "Cerro"
        });

        const response = await request.get("/deliveries");

        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(2);
        expect(response.body[0].state).toBe(delivery.state);
        expect(response.body[0].pickup.pickup_lat).toBe(delivery.pickup.pickup_lat);
        expect(response.body[0].pickup.pickup_lon).toBe(delivery.pickup.pickup_lon);
        expect(response.body[0].dropoff.dropoff_lat).toBe(delivery.dropoff.dropoff_lat);
        expect(response.body[0].dropoff.dropoff_lon).toBe(delivery.dropoff.dropoff_lon);
        expect(response.body[0].zone_id).toBe(delivery.zone_id);

        expect(response.body[1].state).toBe(delivery2.state);
        expect(response.body[1].pickup.pickup_lat).toBe(delivery2.pickup.pickup_lat);
        expect(response.body[1].pickup.pickup_lon).toBe(delivery2.pickup.pickup_lon);
        expect(response.body[1].dropoff.dropoff_lat).toBe(delivery2.dropoff.dropoff_lat);
        expect(response.body[1].dropoff.dropoff_lon).toBe(delivery2.dropoff.dropoff_lon);
        expect(response.body[1].zone_id).toBe(delivery2.zone_id);

    })

    test("POST new delivery /deliveries", async () => {

        const delivery = {
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        };

        const response = await request.post("/deliveries").send(delivery);

        expect(response.status).toBe(201);

        expect(response.body.state).toBe(delivery.state);
        expect(response.body.pickup.pickup_lat).toBe(delivery.pickup.pickup_lat);
        expect(response.body.pickup.pickup_lon).toBe(delivery.pickup.pickup_lon);
        expect(response.body.dropoff.dropoff_lat).toBe(delivery.dropoff.dropoff_lat);
        expect(response.body.dropoff.dropoff_lon).toBe(delivery.dropoff.dropoff_lon);
        expect(response.body.zone_id).toBe(delivery.zone_id);
    })

    test("GET delivery by id /deliveries/:id", async () => {

        const delivery = await Delivery.create({
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        const response = await request.get(`/deliveries/${delivery._id}`);

        expect(response.status).toBe(200);

        expect(response.body.state).toBe(delivery.state);
        expect(response.body.pickup.pickup_lat).toBe(delivery.pickup.pickup_lat);
        expect(response.body.pickup.pickup_lon).toBe(delivery.pickup.pickup_lon);
        expect(response.body.dropoff.dropoff_lat).toBe(delivery.dropoff.dropoff_lat);
        expect(response.body.dropoff.dropoff_lon).toBe(delivery.dropoff.dropoff_lon);
        expect(response.body.zone_id).toBe(delivery.zone_id);
    })

    test("PATCH update some fields in delivery by current id /deliveries/:id", async () => {

        const delivery = await Delivery.create({
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        const delivery2 = {
            creation_date: Date.now(),
            state: "assigned",
            pickup: {
                pickup_lat: 25.00,
                pickup_lon: 81.00
            },
            dropoff: {
                dropoff_lat: 25.10,
                dropoff_lon: 81.10
            },
            zone_id: "Cerro"
        };

        const response = await request.patch(`/deliveries/${delivery._id}`).send(delivery2);

        expect(response.status).toBe(200);

        expect(response.body.state).toBe(delivery2.state);
        expect(response.body.pickup.pickup_lat).toBe(delivery2.pickup.pickup_lat);
        expect(response.body.pickup.pickup_lon).toBe(delivery2.pickup.pickup_lon);
        expect(response.body.dropoff.dropoff_lat).toBe(delivery2.dropoff.dropoff_lat);
        expect(response.body.dropoff.dropoff_lon).toBe(delivery2.dropoff.dropoff_lon);
        expect(response.body.zone_id).toBe(delivery2.zone_id);
    })

    test("Should DELETE a created delivery", async () => {

        const delivery = await Delivery.create({
            creation_date: Date.now(),
            state: "pending",
            pickup: {
                pickup_lat: 24.00,
                pickup_lon: 80.00
            },
            dropoff: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        await Delivery.findByIdAndDelete({ _id: delivery._id });

        const deliveryDeleted = await Delivery.findById(delivery._id);

        expect(deliveryDeleted).toEqual(null);
    })

})

describe("Testing connection to API endpoint /bots", () => {

    test("GET bots list /bots", async () => {

        const bot = await Bot.create({
            status: "available",
            location: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        const bot2 = await Bot.create({
            status: "available",
            location: {
                dropoff_lat: 25.10,
                dropoff_lon: 81.10
            },
            zone_id: "Cerro"
        });

        const response = await request.get("/bots");

        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(2);

        expect(response.body[0].status).toBe(bot.status);
        expect(response.body[0].location.dropoff_lat).toBe(bot.location.dropoff_lat);
        expect(response.body[0].location.dropoff_lon).toBe(bot.location.dropoff_lon);
        expect(response.body[0].zone_id).toBe(bot.zone_id);

        expect(response.body[1].status).toBe(bot2.status);
        expect(response.body[1].location.dropoff_lat).toBe(bot2.location.dropoff_lat);
        expect(response.body[1].location.dropoff_lon).toBe(bot2.location.dropoff_lon);
        expect(response.body[1].zone_id).toBe(bot2.zone_id);

    })

    test("POST new bot /bots", async () => {

        const bot = {
            status: "available",
            location: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        };

        const response = await request.post("/bots").send(bot);

        expect(response.status).toBe(201);

        expect(response.body.status).toBe(bot.status);
        expect(response.body.location.dropoff_lat).toBe(bot.location.dropoff_lat);
        expect(response.body.location.dropoff_lon).toBe(bot.location.dropoff_lon);
        expect(response.body.zone_id).toBe(bot.zone_id);
    })

    test("GET bot by id /bot/:id", async () => {

        const bot = await Bot.create({
            status: "available",
            location: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        const response = await request.get(`/bots/${bot._id}`);

        expect(response.status).toBe(200);

        expect(response.body.status).toBe(bot.status);
        expect(response.body.location.dropoff_lat).toBe(bot.location.dropoff_lat);
        expect(response.body.location.dropoff_lon).toBe(bot.location.dropoff_lon);
        expect(response.body.zone_id).toBe(bot.zone_id);
    })

    test("PATCH update some fields in bot by current id /bots/:id", async () => {

        const bot = await Bot.create({
            status: "available",
            location: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        const bot2 = {
            status: "busy",
            location: {
                dropoff_lat: 25.10,
                dropoff_lon: 81.10
            },
            zone_id: "Cerro"
        };

        const response = await request.patch(`/bots/${bot._id}`).send(bot2);

        expect(response.status).toBe(200);

        expect(response.body.status).toBe(bot2.status);
        expect(response.body.location.dropoff_lat).toBe(bot2.location.dropoff_lat);
        expect(response.body.location.dropoff_lon).toBe(bot2.location.dropoff_lon);
        expect(response.body.zone_id).toBe(bot2.zone_id);
    })

    test("Should DELETE a created bot", async () => {

        const bot = await Bot.create({
            status: "available",
            location: {
                dropoff_lat: 24.10,
                dropoff_lon: 80.10
            },
            zone_id: "Plaza"
        });

        const response = await request.delete(`/bots/${bot._id}`);

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Bot deleted");

        const botDeleted = await Bot.findById(bot._id);

        expect(botDeleted).toEqual(null);
    })

})




















// })


