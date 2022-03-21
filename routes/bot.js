const express = require('express');
const router = express.Router();
const botsController = require('../controllers/botsController');
const { check } = require('express-validator');

// create a bot
// bots
router.post('/',
    [
        check('location.dropoff_lat', 'The dropoff latitude is required').isFloat(),
        check('location.dropoff_lon', 'The dropoff longitude is required').isFloat(),
        check('zone_id', 'The zone id is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
    ],
    botsController.createBot
);

// get the list of all bots
// bots
router.get('/',
    botsController.getBots
);

// get one bot by id
// bots/id
router.get('/:id',
    botsController.getBotById
);

// patch an existing bot
// bots/id
router.patch('/:id',
    botsController.patchBot
);

// delete bot
// bots/id
router.delete('/:id',
    botsController.deleteBot
);

module.exports = router;